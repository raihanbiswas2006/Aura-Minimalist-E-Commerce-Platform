"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  Check,
  ChevronDown,
  Info,
  Banknote,
  Smartphone,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { useAuthStore } from "@/store/auth-store";
import { formatPrice } from "@/lib/utils";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_TIERS,
  BD_DIVISIONS,
  type ShippingTier,
} from "@/lib/constants";
import { ShippingMethod, PaymentMethod } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";

interface FormData {
  email: string;
  fullName: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  streetAddress: string;
  apartment: string;
  postalCode: string;
  keepUpdated: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, couponCode, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const { user } = useAuthStore();

  // Accordion stages: 1 = Contact & Delivery, 2 = Shipping, 3 = Payment
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<"inside-dhaka" | "outside-dhaka" | "nationwide">("inside-dhaka");

  // Payment Method: Default to Cash on Delivery (Bangladesh standard)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [mfsNumber, setMfsNumber] = useState("01711-000000");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 8842");
  const [cardExp, setCardExp] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("382");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields state
  const [formData, setFormData] = useState<FormData>({
    email: user?.email || "",
    fullName: user?.savedAddresses[0]?.fullName || user?.name || "",
    phone: user?.savedAddresses[0]?.phone || "",
    division: user?.savedAddresses[0]?.division || user?.savedAddresses[0]?.state || "Dhaka",
    district: user?.savedAddresses[0]?.district || user?.savedAddresses[0]?.city || "Dhaka",
    area: user?.savedAddresses[0]?.area || "Gulshan-2",
    streetAddress: user?.savedAddresses[0]?.streetAddress || "",
    apartment: user?.savedAddresses[0]?.apartment || "",
    postalCode: user?.savedAddresses[0]?.postalCode || "1212",
    keepUpdated: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs for focusing on first invalid field
  const fieldRefs: Record<string, React.RefObject<HTMLInputElement | HTMLSelectElement | null>> = {
    email: useRef<HTMLInputElement>(null),
    fullName: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    division: useRef<HTMLSelectElement>(null),
    district: useRef<HTMLInputElement>(null),
    area: useRef<HTMLInputElement>(null),
    streetAddress: useRef<HTMLInputElement>(null),
    postalCode: useRef<HTMLInputElement>(null),
  };

  // Pre-fill if user logs in or switches persona
  useEffect(() => {
    if (user && user.savedAddresses[0]) {
      const addr = user.savedAddresses[0];
      setFormData((prev) => ({
        ...prev,
        email: user.email,
        fullName: addr.fullName,
        phone: addr.phone,
        division: addr.division || addr.state || "Dhaka",
        district: addr.district || addr.city || "Dhaka",
        area: addr.area || "",
        streetAddress: addr.streetAddress,
        apartment: addr.apartment || "",
        postalCode: addr.postalCode,
      }));
    }
  }, [user]);

  // Shipping Fee calculation
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || couponCode === "FREESHIP";
  const selectedTier = SHIPPING_TIERS.find((t) => t.id === shippingMethod) || SHIPPING_TIERS[0];
  const activeShippingFee = selectedTier.isComplimentaryEligible && isFreeShipping ? 0.0 : selectedTier.rate;

  const finalTotal = Math.max(0, subtotal - discountAmount + activeShippingFee);

  // Validation function for Bangladesh Address Form
  const validateStage1 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      errs.fullName = "Full name must be at least 2 characters.";
    }
    const cleanPhone = formData.phone.replace(/[\s-]/g, "");
    if (!cleanPhone || !/^(?:\+?880|0)?1[3-9]\d{8}$/.test(cleanPhone)) {
      errs.phone = "Please enter a valid Bangladeshi mobile number (e.g. 017XXXXXXXX or +8801XXXXXXXX).";
    }
    if (!formData.division || formData.division.trim().length === 0) {
      errs.division = "Please select your division.";
    }
    if (!formData.district || formData.district.trim().length < 2) {
      errs.district = "District / City is required.";
    }
    if (!formData.area || formData.area.trim().length < 2) {
      errs.area = "Area / Upazila / Thana is required.";
    }
    if (!formData.streetAddress || formData.streetAddress.trim().length < 5) {
      errs.streetAddress = "Street address must be at least 5 characters.";
    }
    if (!formData.postalCode || formData.postalCode.trim().length < 3) {
      errs.postalCode = "Valid postal code is required (e.g. 1212).";
    }

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      const firstInvalidField = Object.keys(errs)[0];
      fieldRefs[firstInvalidField]?.current?.focus();
      return false;
    }

    return true;
  };

  const handleContinueToShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStage1()) {
      setCompletedStages((prev) => Array.from(new Set([...prev, 1])));
      setActiveStage(2);
    }
  };

  const handleContinueToPayment = () => {
    setCompletedStages((prev) => Array.from(new Set([...prev, 2])));
    setActiveStage(3);
  };

  const handleCompleteOrder = () => {
    setIsSubmitting(true);

    trackEvent("begin_checkout", {
      subtotal,
      shippingMethod,
      total: finalTotal,
    });

    setTimeout(() => {
      const order = createOrder({
        items,
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          division: formData.division,
          district: formData.district,
          area: formData.area,
          streetAddress: formData.streetAddress,
          apartment: formData.apartment,
          city: formData.district,
          state: formData.division,
          postalCode: formData.postalCode,
          country: "Bangladesh",
        },
        shippingMethod,
        paymentMethod,
        pricing: {
          subtotal,
          discount: discountAmount,
          shipping: activeShippingFee,
          tax: 0.0,
          total: finalTotal,
        },
      });

      trackEvent("purchase", {
        orderId: order.id,
        total: finalTotal,
        itemCount: items.length,
      });

      clearCart();
      router.push(`/order/${order.id}/confirmation`);
    }, 1000);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-white border border-[#E4E7EB] flex items-center justify-center mx-auto mb-4 text-[#9CA3AF]">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-serif font-semibold text-[#14171A]">
          Your bag is empty
        </h2>
        <p className="text-xs text-[#6B7280] mt-2 mb-6">
          Add pieces to your shopping cart before initiating checkout.
        </p>
        <Link href="/c/furniture">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left 7 Columns: 3-Stage Accordion Flow */}
        <div className="lg:col-span-7 space-y-6">
          {/* ======================================================== */}
          {/* STAGE 1: Contact & Delivery Details (Bangladesh System) */}
          {/* ======================================================== */}
          <div className="bg-white rounded-xl border border-[#E4E7EB] overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveStage(1)}
              className="w-full p-6 flex items-center justify-between text-left cursor-pointer border-b border-[#E4E7EB]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    completedStages.includes(1)
                      ? "bg-[#18804E] text-white"
                      : "bg-[#1F4E43] text-white"
                  }`}
                >
                  {completedStages.includes(1) ? <Check className="w-4 h-4" /> : "1"}
                </div>
                <div>
                  <h2 className="text-base font-serif font-semibold text-[#14171A]">
                    Delivery &amp; Contact Details (Bangladesh)
                  </h2>
                  {completedStages.includes(1) && (
                    <p className="text-xs text-[#6B7280] mt-0.5 truncate">
                      {formData.fullName} • {formData.area}, {formData.district} • {formData.phone}
                    </p>
                  )}
                </div>
              </div>

              {completedStages.includes(1) && activeStage !== 1 && (
                <span className="text-xs text-[#1F4E43] hover:underline font-medium">
                  Edit
                </span>
              )}
            </button>

            {activeStage === 1 && (
              <form onSubmit={handleContinueToShipping} className="p-6 space-y-4">
                <div className="space-y-4">
                  {/* Full Name & Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      ref={fieldRefs.fullName as React.RefObject<HTMLInputElement>}
                      label="Full Name *"
                      placeholder="e.g. Arif Rahman"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      error={errors.fullName}
                    />

                    <Input
                      ref={fieldRefs.phone as React.RefObject<HTMLInputElement>}
                      label="Mobile Number (01XXXXXXXXX) *"
                      type="tel"
                      placeholder="e.g. 01711000000"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      error={errors.phone}
                    />
                  </div>

                  {/* Email & Update Checkbox */}
                  <div>
                    <Input
                      ref={fieldRefs.email as React.RefObject<HTMLInputElement>}
                      label="Email Address *"
                      type="email"
                      placeholder="e.g. arif@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      error={errors.email}
                    />
                    <label className="flex items-center gap-2 mt-2 text-xs text-[#6B7280] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.keepUpdated}
                        onChange={(e) =>
                          setFormData({ ...formData, keepUpdated: e.target.checked })
                        }
                        className="w-4 h-4 text-[#1F4E43] rounded-sm border-[#E4E7EB] focus:ring-[#1F4E43]"
                      />
                      <span>Send delivery notifications and simulated courier tracking</span>
                    </label>
                  </div>

                  {/* Division, District, Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label
                        htmlFor="checkout-division"
                        className="block text-xs font-semibold text-[#14171A] mb-1.5"
                      >
                        Division *
                      </label>
                      <select
                        id="checkout-division"
                        ref={fieldRefs.division as React.RefObject<HTMLSelectElement>}
                        value={formData.division}
                        onChange={(e) =>
                          setFormData({ ...formData, division: e.target.value })
                        }
                        className="w-full h-11 px-3 text-sm bg-white border border-[#E4E7EB] rounded-md focus-visible:outline-2 focus-visible:outline-[#1F4E43]"
                      >
                        {BD_DIVISIONS.map((div) => (
                          <option key={div} value={div}>
                            {div}
                          </option>
                        ))}
                      </select>
                      {errors.division && (
                        <p className="mt-1 text-xs text-[#C2222E]">{errors.division}</p>
                      )}
                    </div>

                    <div>
                      <Input
                        ref={fieldRefs.district as React.RefObject<HTMLInputElement>}
                        label="District / City *"
                        placeholder="e.g. Dhaka, Gazipur"
                        value={formData.district}
                        onChange={(e) =>
                          setFormData({ ...formData, district: e.target.value })
                        }
                        error={errors.district}
                      />
                    </div>

                    <div>
                      <Input
                        ref={fieldRefs.area as React.RefObject<HTMLInputElement>}
                        label="Area / Thana *"
                        placeholder="e.g. Gulshan-2, Dhanmondi"
                        value={formData.area}
                        onChange={(e) =>
                          setFormData({ ...formData, area: e.target.value })
                        }
                        error={errors.area}
                      />
                    </div>
                  </div>

                  {/* Street Address & Postal Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <Input
                        ref={fieldRefs.streetAddress as React.RefObject<HTMLInputElement>}
                        label="Detailed Address (House, Road, Block) *"
                        placeholder="e.g. Road 71, House 14, Block D"
                        value={formData.streetAddress}
                        onChange={(e) =>
                          setFormData({ ...formData, streetAddress: e.target.value })
                        }
                        error={errors.streetAddress}
                      />
                    </div>
                    <div>
                      <Input
                        ref={fieldRefs.postalCode as React.RefObject<HTMLInputElement>}
                        label="Postal Code *"
                        placeholder="e.g. 1212"
                        value={formData.postalCode}
                        onChange={(e) =>
                          setFormData({ ...formData, postalCode: e.target.value })
                        }
                        error={errors.postalCode}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E4E7EB]">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full sm:w-auto flex items-center gap-2"
                  >
                    <span>Continue to Shipping Method</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* ======================================================== */}
          {/* STAGE 2: Bangladesh Shipping Selection */}
          {/* ======================================================== */}
          <div className="bg-white rounded-xl border border-[#E4E7EB] overflow-hidden shadow-2xs">
            <button
              type="button"
              disabled={!completedStages.includes(1)}
              onClick={() => {
                if (completedStages.includes(1)) setActiveStage(2);
              }}
              className={`w-full p-6 flex items-center justify-between text-left border-b border-[#E4E7EB] ${
                completedStages.includes(1) ? "cursor-pointer" : "cursor-not-allowed opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    completedStages.includes(2)
                      ? "bg-[#18804E] text-white"
                      : activeStage === 2
                      ? "bg-[#1F4E43] text-white"
                      : "bg-[#E4E7EB] text-[#6B7280]"
                  }`}
                >
                  {completedStages.includes(2) ? <Check className="w-4 h-4" /> : "2"}
                </div>
                <div>
                  <h2 className="text-base font-serif font-semibold text-[#14171A]">
                    Shipping &amp; Delivery Tier
                  </h2>
                  {completedStages.includes(2) && (
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      {selectedTier.label} ({activeShippingFee === 0 ? "FREE" : formatPrice(activeShippingFee)})
                    </p>
                  )}
                </div>
              </div>

              {completedStages.includes(1) && activeStage !== 2 && (
                <span className="text-xs text-[#1F4E43] hover:underline font-medium">
                  Edit
                </span>
              )}
            </button>

            {activeStage === 2 && (
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  {SHIPPING_TIERS.map((tier) => {
                    const isSelected = shippingMethod === tier.id;
                    const isTierFree = tier.isComplimentaryEligible && isFreeShipping;
                    return (
                      <label
                        key={tier.id}
                        className={`flex items-center justify-between p-4 rounded-lg border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#1F4E43] bg-[#1F4E43]/5 ring-1 ring-[#1F4E43]"
                            : "border-[#E4E7EB] hover:border-[#D1D5DB]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping-method"
                            checked={isSelected}
                            onChange={() => setShippingMethod(tier.id)}
                            className="w-4 h-4 text-[#1F4E43] border-[#E4E7EB] focus:ring-[#1F4E43]"
                          />
                          <div>
                            <p className="font-semibold text-sm text-[#14171A]">
                              {tier.label} ({tier.estimatedDays})
                            </p>
                            <p className="text-xs text-[#6B7280] mt-0.5">{tier.sublabel}</p>
                          </div>
                        </div>
                        <span className="font-bold text-sm text-[#14171A]">
                          {isTierFree ? (
                            <span className="text-[#18804E]">FREE</span>
                          ) : (
                            formatPrice(tier.rate)
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-[#E4E7EB]">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleContinueToPayment}
                    className="w-full sm:w-auto flex items-center gap-2"
                  >
                    <span>Continue to Payment Simulation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* STAGE 3: Simulated Bangladesh Payment Methods (Demo) */}
          {/* ======================================================== */}
          <div className="bg-white rounded-xl border border-[#E4E7EB] overflow-hidden shadow-2xs">
            <div className="p-6 flex items-center gap-3 border-b border-[#E4E7EB]">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  activeStage === 3
                    ? "bg-[#1F4E43] text-white"
                    : "bg-[#E4E7EB] text-[#6B7280]"
                }`}
              >
                3
              </div>
              <h2 className="text-base font-serif font-semibold text-[#14171A]">
                Payment Selection (Simulated Sandbox)
              </h2>
            </div>

            {activeStage === 3 && (
              <div className="p-6 space-y-5">
                {/* Sandbox disclaimer */}
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E4E7EB] flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#1F4E43] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-[#14171A] uppercase tracking-wider">
                      Demo Environment &amp; Simulation Boundary
                    </h3>
                    <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                      No real financial transaction will occur. Payment methods below operate client-side for evaluating the Bangladesh consumer checkout experience.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Cash on Delivery (COD) */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-lg border text-xs cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#1F4E43] bg-[#1F4E43]/5 ring-1 ring-[#1F4E43]"
                        : "border-[#E4E7EB] hover:border-[#D1D5DB]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="w-4 h-4 text-[#1F4E43] border-[#E4E7EB] focus:ring-[#1F4E43] mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[#14171A] flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-[#1F4E43]" />
                          Cash on Delivery (Demo COD)
                        </span>
                        <span className="text-[10px] text-[#18804E] font-medium bg-[#18804E]/10 px-2 py-0.5 rounded-full">
                          Most Popular
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-1">
                        Pay with cash upon physical courier handover at your doorstep anywhere across Bangladesh.
                      </p>
                    </div>
                  </label>

                  {/* bKash Demo */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-lg border text-xs cursor-pointer transition-all ${
                      paymentMethod === "bkash"
                        ? "border-[#1F4E43] bg-[#1F4E43]/5 ring-1 ring-[#1F4E43]"
                        : "border-[#E4E7EB] hover:border-[#D1D5DB]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === "bkash"}
                      onChange={() => setPaymentMethod("bkash")}
                      className="w-4 h-4 text-[#1F4E43] border-[#E4E7EB] focus:ring-[#1F4E43] mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[#14171A] flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-[#E2136E]" />
                          bKash (Demo Simulation)
                        </span>
                        <span className="text-[10px] text-[#E2136E] font-medium bg-[#E2136E]/10 px-2 py-0.5 rounded-full">
                          Demo MFS
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-1">
                        Instant simulated payment via bKash mobile financial service.
                      </p>
                      {paymentMethod === "bkash" && (
                        <div className="mt-3 pt-3 border-t border-[#E4E7EB] space-y-2">
                          <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                            Demo bKash Number
                          </label>
                          <input
                            type="text"
                            value={mfsNumber}
                            onChange={(e) => setMfsNumber(e.target.value)}
                            className="w-full h-10 px-3 border border-[#E4E7EB] rounded-md text-xs font-mono bg-white"
                          />
                          <p className="text-[11px] text-[#9CA3AF]">
                            Mock PIN/OTP confirmation will simulate automatically upon submitting order.
                          </p>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Nagad Demo */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-lg border text-xs cursor-pointer transition-all ${
                      paymentMethod === "nagad"
                        ? "border-[#1F4E43] bg-[#1F4E43]/5 ring-1 ring-[#1F4E43]"
                        : "border-[#E4E7EB] hover:border-[#D1D5DB]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === "nagad"}
                      onChange={() => setPaymentMethod("nagad")}
                      className="w-4 h-4 text-[#1F4E43] border-[#E4E7EB] focus:ring-[#1F4E43] mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[#14171A] flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-[#F7931E]" />
                          Nagad (Demo Simulation)
                        </span>
                        <span className="text-[10px] text-[#F7931E] font-medium bg-[#F7931E]/10 px-2 py-0.5 rounded-full">
                          Demo MFS
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-1">
                        Simulated checkout using Bangladesh Post Office digital financial service.
                      </p>
                    </div>
                  </label>

                  {/* Rocket Demo */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-lg border text-xs cursor-pointer transition-all ${
                      paymentMethod === "rocket"
                        ? "border-[#1F4E43] bg-[#1F4E43]/5 ring-1 ring-[#1F4E43]"
                        : "border-[#E4E7EB] hover:border-[#D1D5DB]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === "rocket"}
                      onChange={() => setPaymentMethod("rocket")}
                      className="w-4 h-4 text-[#1F4E43] border-[#E4E7EB] focus:ring-[#1F4E43] mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[#14171A] flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-[#8C3494]" />
                          Rocket (DBBL Demo Simulation)
                        </span>
                        <span className="text-[10px] text-[#8C3494] font-medium bg-[#8C3494]/10 px-2 py-0.5 rounded-full">
                          Demo MFS
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-1">
                        Dutch-Bangla Bank Rocket mobile banking simulation.
                      </p>
                    </div>
                  </label>

                  {/* Simulated Card Payment */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-lg border text-xs cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-[#1F4E43] bg-[#1F4E43]/5 ring-1 ring-[#1F4E43]"
                        : "border-[#E4E7EB] hover:border-[#D1D5DB]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="w-4 h-4 text-[#1F4E43] border-[#E4E7EB] focus:ring-[#1F4E43] mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[#14171A] flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#1F4E43]" />
                          Debit / Credit Card (Demo Sandbox)
                        </span>
                        <span className="text-[10px] text-[#6B7280] font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                          Simulated
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-1">
                        Simulated card processing for portfolio evaluation.
                      </p>

                      {paymentMethod === "card" && (
                        <div className="mt-4 space-y-3 pt-3 border-t border-[#E4E7EB]">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
                              Card Number (Demo Sandbox)
                            </label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full h-11 px-3 border border-[#E4E7EB] rounded-md text-sm bg-white font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
                                Expires (MM/YY)
                              </label>
                              <input
                                type="text"
                                value={cardExp}
                                onChange={(e) => setCardExp(e.target.value)}
                                className="w-full h-11 px-3 border border-[#E4E7EB] rounded-md text-sm bg-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
                                CVC / CVV
                              </label>
                              <input
                                type="text"
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value)}
                                className="w-full h-11 px-3 border border-[#E4E7EB] rounded-md text-sm bg-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* Submit Order Button */}
                <div className="pt-4 border-t border-[#E4E7EB]">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    onClick={handleCompleteOrder}
                    className="w-full h-13 text-base font-semibold shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Complete Order ({formatPrice(finalTotal)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Columns: Persistent Order Summary Panel */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E4E7EB] p-6 shadow-2xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EB]">
            <h2 className="font-serif text-lg font-semibold text-[#14171A]">
              Order Summary ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
            <Link
              href="/cart"
              className="text-xs text-[#1F4E43] hover:underline font-medium"
            >
              Modify Bag
            </Link>
          </div>

          {/* Itemized Line Items */}
          <div className="max-h-60 overflow-y-auto divide-y divide-[#F3F4F6] pr-1">
            {items.map((item) => (
              <div key={item.id} className="py-3 flex items-center gap-3">
                <div className="relative w-14 aspect-4/5 rounded bg-[#FAF9F6] border border-[#E4E7EB] overflow-hidden shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                  <span className="absolute top-0 right-0 bg-[#14171A] text-white text-[10px] px-1 rounded-bl font-bold">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-[#14171A] truncate">{item.title}</h3>
                  <p className="text-[11px] text-[#6B7280]">{item.variantName}</p>
                </div>
                <span className="text-xs font-bold text-[#14171A] shrink-0">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Calculations Breakdown */}
          <div className="space-y-2.5 pt-4 border-t border-[#E4E7EB] text-xs">
            <div className="flex justify-between text-[#6B7280]">
              <span>Subtotal</span>
              <span className="font-medium text-[#14171A]">{formatPrice(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-[#18804E] font-medium">
                <span>Promotional Discount ({couponCode})</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#6B7280]">
              <span>Shipping ({selectedTier.label})</span>
              <span className="font-medium text-[#14171A]">
                {activeShippingFee === 0 ? "FREE" : formatPrice(activeShippingFee)}
              </span>
            </div>

            <div className="flex justify-between text-[#6B7280]">
              <span>Estimated Sales Tax</span>
              <span className="font-medium text-[#14171A]">{formatPrice(0)} (Included)</span>
            </div>

            <div className="flex justify-between text-base font-bold text-[#14171A] pt-3 border-t border-[#E4E7EB]">
              <span>Total Due</span>
              <span className="text-[#1F4E43] text-lg font-serif">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
