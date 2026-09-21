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
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { useAuthStore } from "@/store/auth-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";

interface FormData {
  email: string;
  fullName: string;
  streetAddress: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
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
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExp, setCardExp] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("382");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields state
  const [formData, setFormData] = useState<FormData>({
    email: user?.email || "",
    fullName: user?.savedAddresses[0]?.fullName || user?.name || "",
    streetAddress: user?.savedAddresses[0]?.streetAddress || "",
    apartment: user?.savedAddresses[0]?.apartment || "",
    city: user?.savedAddresses[0]?.city || "",
    state: user?.savedAddresses[0]?.state || "",
    postalCode: user?.savedAddresses[0]?.postalCode || "",
    phone: user?.savedAddresses[0]?.phone || "",
    keepUpdated: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs for focusing on first invalid field per AC-03
  const fieldRefs: Record<string, React.RefObject<HTMLInputElement | null>> = {
    email: useRef<HTMLInputElement>(null),
    fullName: useRef<HTMLInputElement>(null),
    streetAddress: useRef<HTMLInputElement>(null),
    city: useRef<HTMLInputElement>(null),
    state: useRef<HTMLInputElement>(null),
    postalCode: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
  };

  // Pre-fill if user logs in
  useEffect(() => {
    if (user && user.savedAddresses[0]) {
      const addr = user.savedAddresses[0];
      setFormData((prev) => ({
        ...prev,
        email: user.email,
        fullName: addr.fullName,
        streetAddress: addr.streetAddress,
        apartment: addr.apartment || "",
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        phone: addr.phone,
      }));
    }
  }, [user]);

  // Shipping Fee calculation
  const isFreeStandardShipping = subtotal >= 150 || couponCode === "FREESHIP";
  const standardShippingFee = isFreeStandardShipping ? 0.0 : 15.0;
  const expressShippingFee = 25.0;
  const activeShippingFee = shippingMethod === "standard" ? standardShippingFee : expressShippingFee;

  const finalTotal = Math.max(0, subtotal - discountAmount + activeShippingFee);

  // Validation function per Section 15.2
  const validateStage1 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      errs.fullName = "Full name must be at least 2 characters.";
    }
    if (!formData.streetAddress || formData.streetAddress.trim().length < 5) {
      errs.streetAddress = "Street address must be at least 5 characters.";
    }
    if (!formData.city || formData.city.trim().length < 2) {
      errs.city = "City must be at least 2 characters.";
    }
    if (!formData.state || formData.state.trim().length < 2) {
      errs.state = "Region / State is required.";
    }
    if (!formData.postalCode || formData.postalCode.trim().length < 3) {
      errs.postalCode = "Valid postal code is required.";
    }
    if (!formData.phone || formData.phone.replace(/\D/g, "").length < 7) {
      errs.phone = "Phone number must be at least 7 digits for courier delivery.";
    }

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      // Focus on first invalid field (AC-03)
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
          streetAddress: formData.streetAddress,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: "United States",
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
          {/* STAGE 1: Contact & Delivery Details */}
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
                      : activeStage === 1
                      ? "bg-[#1F4E43] text-white"
                      : "bg-[#E4E7EB] text-[#6B7280]"
                  }`}
                >
                  {completedStages.includes(1) ? <Check className="w-4 h-4" /> : "1"}
                </div>
                <div>
                  <h2 className="text-base font-serif font-semibold text-[#14171A]">
                    Customer &amp; Delivery Details
                  </h2>
                  {completedStages.includes(1) && (
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      {formData.fullName} • {formData.streetAddress}, {formData.city}
                    </p>
                  )}
                </div>
              </div>

              {activeStage !== 1 && (
                <span className="text-xs text-[#1F4E43] hover:underline font-medium">
                  Edit
                </span>
              )}
            </button>

            {activeStage === 1 && (
              <form onSubmit={handleContinueToShipping} className="p-6 space-y-4">
                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <Input
                      ref={fieldRefs.email}
                      label="Email Address *"
                      type="email"
                      placeholder="e.g. marcus@example.com"
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
                      <span>Keep me updated on delivery tracking &amp; status</span>
                    </label>
                  </div>

                  {/* Full Name */}
                  <Input
                    ref={fieldRefs.fullName}
                    label="Full Name *"
                    placeholder="e.g. Marcus Vance"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    error={errors.fullName}
                  />

                  {/* Street Address & Apt */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <Input
                        ref={fieldRefs.streetAddress}
                        label="Street Address *"
                        placeholder="e.g. 742 Montgomery St"
                        value={formData.streetAddress}
                        onChange={(e) =>
                          setFormData({ ...formData, streetAddress: e.target.value })
                        }
                        error={errors.streetAddress}
                      />
                    </div>
                    <div>
                      <Input
                        label="Apt / Suite (Optional)"
                        placeholder="e.g. 4B"
                        value={formData.apartment}
                        onChange={(e) =>
                          setFormData({ ...formData, apartment: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* City, State, Postal */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Input
                        ref={fieldRefs.city}
                        label="City *"
                        placeholder="e.g. San Francisco"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        error={errors.city}
                      />
                    </div>
                    <div>
                      <Input
                        ref={fieldRefs.state}
                        label="State / Region *"
                        placeholder="e.g. CA"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        error={errors.state}
                      />
                    </div>
                    <div>
                      <Input
                        ref={fieldRefs.postalCode}
                        label="Postal Code *"
                        placeholder="e.g. 94111"
                        value={formData.postalCode}
                        onChange={(e) =>
                          setFormData({ ...formData, postalCode: e.target.value })
                        }
                        error={errors.postalCode}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <Input
                    ref={fieldRefs.phone}
                    label="Phone (for courier delivery notifications) *"
                    type="tel"
                    placeholder="e.g. 4155552671"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    error={errors.phone}
                  />
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
          {/* STAGE 2: Shipping Method */}
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
                    Shipping Method
                  </h2>
                  {completedStages.includes(2) && (
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      {shippingMethod === "standard"
                        ? `Standard Delivery (${isFreeStandardShipping ? "FREE" : "$15.00"})`
                        : "Express Courier Delivery ($25.00)"}
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
                  {/* Standard Shipping */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-lg border text-xs cursor-pointer transition-all ${
                      shippingMethod === "standard"
                        ? "border-[#1F4E43] bg-[#1F4E43]/5 ring-1 ring-[#1F4E43]"
                        : "border-[#E4E7EB] hover:border-[#D1D5DB]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping-method"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                        className="w-4 h-4 text-[#1F4E43] border-[#E4E7EB] focus:ring-[#1F4E43]"
                      />
                      <div>
                        <p className="font-semibold text-sm text-[#14171A]">
                          Standard Domestic Delivery (3–5 Business Days)
                        </p>
                        <p className="text-xs text-[#6B7280] mt-0.5">
                          100% Carbon-Neutral transportation via ground courier
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-[#14171A]">
                      {isFreeStandardShipping ? (
                        <span className="text-[#18804E]">FREE</span>
                      ) : (
                        "$15.00"
                      )}
                    </span>
                  </label>

                  {/* Express Shipping */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-lg border text-xs cursor-pointer transition-all ${
                      shippingMethod === "express"
                        ? "border-[#1F4E43] bg-[#1F4E43]/5 ring-1 ring-[#1F4E43]"
                        : "border-[#E4E7EB] hover:border-[#D1D5DB]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping-method"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                        className="w-4 h-4 text-[#1F4E43] border-[#E4E7EB] focus:ring-[#1F4E43]"
                      />
                      <div>
                        <p className="font-semibold text-sm text-[#14171A]">
                          Express Courier Delivery (1–2 Business Days)
                        </p>
                        <p className="text-xs text-[#6B7280] mt-0.5">
                          Priority dispatch with scheduled delivery window
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-[#14171A]">$25.00</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-[#E4E7EB]">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleContinueToPayment}
                    className="w-full sm:w-auto flex items-center gap-2"
                  >
                    <span>Continue to Payment Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* STAGE 3: Simulated Payment Method (Demo Sandbox) */}
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
                Payment Method (Simulated Demo Sandbox)
              </h2>
            </div>

            {activeStage === 3 && (
              <div className="p-6 space-y-5">
                {/* Sandbox notice per Section 15.1 */}
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E4E7EB] flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#1F4E43] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-[#14171A] uppercase tracking-wider">
                      Demo Environment Notice
                    </h3>
                    <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                      No real financial transaction will take place. Card input fields below are pre-populated with test sandbox credentials for portfolio validation.
                    </p>
                  </div>
                </div>

                {/* Radio selection: Card vs COD */}
                <div className="space-y-3">
                  {/* Simulated Card */}
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
                          Simulated Credit / Debit Card
                        </span>
                        <span className="text-[10px] text-[#18804E] font-medium bg-[#18804E]/10 px-2 py-0.5 rounded-full">
                          Test Sandbox
                        </span>
                      </div>

                      {paymentMethod === "card" && (
                        <div className="mt-4 space-y-3 pt-3 border-t border-[#E4E7EB]">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
                              Card Number (Demo)
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
                    <div>
                      <span className="font-semibold text-sm text-[#14171A] flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#1F4E43]" />
                        Cash on Delivery (Demo COD)
                      </span>
                      <p className="text-xs text-[#6B7280] mt-1">
                        Pay upon courier arrival at your physical address.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Final Submit Button */}
                <div className="pt-4 border-t border-[#E4E7EB]">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    onClick={handleCompleteOrder}
                    className="w-full h-13 text-base font-semibold shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Complete Demo Order ({formatPrice(finalTotal)})</span>
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
              <span>Shipping ({shippingMethod})</span>
              <span className="font-medium text-[#14171A]">
                {activeShippingFee === 0 ? "FREE" : formatPrice(activeShippingFee)}
              </span>
            </div>

            <div className="flex justify-between text-[#6B7280]">
              <span>Estimated Sales Tax</span>
              <span className="font-medium text-[#14171A]">$0.00 (Included)</span>
            </div>

            <div className="flex justify-between text-base font-bold text-[#14171A] pt-3 border-t border-[#E4E7EB]">
              <span>Total Due</span>
              <span className="text-[#1F4E43] text-lg">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
