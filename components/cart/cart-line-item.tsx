"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { CartItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

interface CartLineItemProps {
  item: CartItem;
  onItemClick?: () => void;
}

export function CartLineItem({ item, onItemClick }: CartLineItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-4 border-b border-[#E4E7EB] last:border-0 items-start">
      {/* 4:5 Aspect Ratio Image */}
      <div className="relative w-20 aspect-4/5 shrink-0 bg-[#F3F4F6] rounded-md overflow-hidden border border-[#E4E7EB]">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-[#14171A] truncate hover:text-[#1F4E43]">
          <Link href={`/p/${item.productId.replace("prod-", "")}`} onClick={onItemClick}>
            {item.title}
          </Link>
        </h3>
        <p className="text-xs text-[#6B7280] mt-0.5">{item.variantName}</p>
        <p className="text-sm font-semibold text-[#14171A] mt-1">
          {formatPrice(item.unitPrice)}
        </p>

        {/* Stepper & Remove */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-[#E4E7EB] rounded-md bg-white">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 text-[#6B7280] hover:text-[#14171A] disabled:opacity-30 cursor-pointer"
              aria-label={`Decrease quantity of ${item.title}`}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-semibold text-[#14171A]">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.maxStock}
              className="p-1 text-[#6B7280] hover:text-[#14171A] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label={`Increase quantity of ${item.title}`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="text-xs text-[#6B7280] hover:text-[#C2222E] flex items-center gap-1 transition-colors p-1 cursor-pointer"
            aria-label={`Remove ${item.title} from cart`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="sr-only sm:not-sr-only">Remove</span>
          </button>
        </div>

        {item.quantity >= item.maxStock && (
          <p className="text-[11px] text-[#F59E0B] mt-1 font-medium">
            Max available stock reached ({item.maxStock})
          </p>
        )}
      </div>
    </div>
  );
}
