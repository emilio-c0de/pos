import { useCartDrawerStore } from "./cart/cart-drawer.slice";
import { useCartStore } from "./cart/cart.slice";
import { useItemStore } from "./item.slice";
import { useSharedStore } from "./shared.slice";

export const usePosStore = {
    sharedStore: useSharedStore, 
    itemStore: useItemStore,
    cartStore: useCartStore,
    cartDrawerStore: useCartDrawerStore
}