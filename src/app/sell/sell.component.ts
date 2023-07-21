import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { InformationService } from '../services/information.service';
import { CartService, Cart, CartItem } from '../services/cart.service';
import { Product } from '../shared/products';
// import { Cart, CartItem } from '../services/cart.service';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent implements OnInit {
  carts: Cart[] = [];
  currentCart!: Cart;
  totalPrice: number = 0;
  buyerName: string = '';
  buyerPhoneNumber: string = '';
  discount: number = 0;
  userType: string = 'user';
  payType: string = 'cash';
  paid: number = 0;
  total: number = 0;
  owing: number=0;
  pastOwing:number =0;
  dollarPrice: any = 1; // default value, can be changed according to currency conversion rate
  cart:any;
  cartId: number = 1;
  products: any;
  constructor(private cartService: CartService,
    private informationService: InformationService) { }

  ngOnInit() {
    this.carts = this.cartService.getCarts();
    this.currentCart = this.cartService.getCart(this.cartId);
    this.products = this.currentCart.products;
    this.getdollarPrice();
    this.getTotalPrice();
    this.paid = this.currentCart.paid;
    this.discount = this.currentCart.discount;
    this.buyerName = this.currentCart.buyerName;
    this.buyerPhoneNumber = this.currentCart.phoneNumber;
    this.payType = this.currentCart.payType;
    this.userType = this.currentCart.buyerType;
    this.totalPrice = this.currentCart.totalPrice;
    this.total = this.currentCart.total;
    console.log(this.currentCart);
  }

  createNewCart() {
    const cartName = prompt('Enter cart name:');
    if (cartName) {
      this.cartService.addCart(cartName, this.buyerName, this.buyerPhoneNumber, '', new Date());
      this.carts = this.cartService.getCarts();
      const cart = this.carts.find(cart => (cart: { cartName: string; }) => cart.cartName === cartName);
      if (cart) {
        this.currentCart = cart;
      }
      this.getTotalPrice();
    }
  }

  onCartChange(cartId: number) {
    console.log('changed' + cartId)
    const cart = this.cartService.getCart(cartId);
    if (cart) {
      this.currentCart = cart;
      this.products = cart.products;
      this.buyerName = cart.buyerName;
      this.buyerPhoneNumber = this.currentCart.phoneNumber;
      this.userType = this.currentCart.buyerType;
      this.payType = this.currentCart.payType;
      this.discount = this.currentCart.discount;
      this.paid = this.currentCart.paid;
      this.totalPrice = this.currentCart.totalPrice;
      this.total = this.currentCart.total;
      console.log(this.currentCart);
      this.getTotalPrice();
    }
  }

  updateCartItemQuantity(cartItem: CartItem) {
    try {
      this.cartService.updateProductQuantity(this.currentCart.id - 1, this.currentCart.products.indexOf(cartItem), cartItem.quantity, this.userType);
      this.getTotalPrice();
    } catch (e : any) {
      alert(e.message);
    }
  }

  deleteCartItem(cartItem: CartItem) {
    this.cartService.deleteProduct(this.currentCart.id - 1, this.currentCart.products.indexOf(cartItem));
    this.currentCart = this.cartService.getCart(this.currentCart.id - 1);
    this.getTotalPrice();
  }

  deleteCart() {
    this.cartService.deleteCart(this.currentCart.id);
  }

  updateCartInformation() {
    this.currentCart.buyerName = this.buyerName;
    this.currentCart.phoneNumber = this.buyerPhoneNumber;
    this.currentCart.paid = this.paid;
    this.currentCart.payType = this.payType;
    this.currentCart.buyerType = this.userType;
    this.currentCart.discount = this.discount;
    this.currentCart.totalPrice = this.totalPrice;
    this.currentCart.total = this.total;
    this.cartService.updateCart(this.currentCart.id - 1, this.currentCart);
    this.getTotalPrice();
  }

  getTotalPrice() {
    let total = 0;
    for (const item of this.currentCart.products) {
      // let price = this.userType === 'user' ? item.product.userSellingPrice : item.quantity >= 3 ? item.product.deallerSellingPriceAll : item.product.deallerSellingPrice;
      let price = item.product.userSellingPrice;
      if (this.userType === 'dealer') {
        if (item.quantity >= 3) {
          price = item.product.deallerSellingPriceAll;
        } else {
          price = item.product.deallerSellingPrice;
        }
      }
      total += price * item.quantity;
    }
    this.totalPrice = total * this.dollarPrice;
    this.total = (this.totalPrice - this.discount) + this.pastOwing ;
    this.owing = this.total - this.paid;
  }

  getdollarPrice() {
    this.informationService.getDollatPrice().subscribe(
      (dollar) => {
        let index = 'price';
        this.dollarPrice = dollar[index as keyof typeof dollar];
        console.log(this.dollarPrice);
      }
    )
  }
}