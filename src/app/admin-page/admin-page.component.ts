import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, Buyer, Cart } from '../services/cart.service';
import { AuthService } from '../auth/auth.service';
import { ProductsQuery } from '../shared/products';
import { ProductSection } from '../shared/information';
import { InformationService } from '../services/information.service';
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
  buyers: Buyer[] = [];
  allBuyers: Buyer[] = [];
  DevicesCount!:number;
  filteredDevicesCount !: number;
  productSections: ProductSection[] = [];
  allFileterdBuyers: Buyer[] = [];
  cartsQuery: ProductsQuery = {
    category: '',
    payType: '',
    buyerType: '',
    sellerName: '',
    today: false,
    thisMonth: true,
    thisYear: false,
    specificYear: '',
    status: '',
    startDate: '',
    endDate: '',
    thisWeek: false
  };
  users:any;
  page: number = 0;
  itemToload: number = 0;
  currentUser: string | null;
  user: any;
  constructor(private cartService: CartService, private router: Router, private informationService: InformationService,
    private authService: AuthService) {
    this.currentUser = localStorage.getItem('user');
      if (this.currentUser) {
        this.user = JSON.parse(this.currentUser);
      }
  }

  ngOnInit(): void {
    localStorage.setItem("location", "admin");
    this.getBuyers();
    this.getUsers();
    const cardsContainer =  document.getElementById('cards-container');
    if (cardsContainer) {
      cardsContainer.addEventListener('scroll', event => {
        const { scrollHeight, scrollTop, clientHeight } = (event.target as Element);

        if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
            console.log('scrolled');
            if (this.allFileterdBuyers.length > this.buyers.length) {
              this.itemToload += 10;
              this.buyers = this.allFileterdBuyers.slice(0, this.itemToload);
              console.log(' scrolling loaded');
            }
        }
      });
    }
    this.getInformations();
  }
  getUsers() {
    this.authService.getUsers().subscribe(
      (users) => {
        this.users = users;
      }
    )
  }

  getBuyers() {
    this.cartService.getBuyers().subscribe(
      (buyers) => {
        this.allBuyers = buyers;
        this.buyers = buyers;
        this.filterCarts();
      }
    );
  }

  getInformations() {
    this.informationService.getProductSections().subscribe(
      (productSections) => {
        this.productSections = productSections;
      }
    )
  }

  loadDevices() {
      this.itemToload = 10;
      this.buyers = this.allFileterdBuyers.slice(0, this.itemToload);
      console.log('esleLoaded');
  }

  filterCarts() {
    this.buyers = this.allBuyers;
    const filterCriteria = {
      category: this.cartsQuery.category,
      payType: this.cartsQuery.payType,
      buyerType: this.cartsQuery.buyerType,
      sellerName: this.cartsQuery.sellerName,
      status: this.cartsQuery.status,
      today: this.cartsQuery.today,
      thisWeek: this.cartsQuery.thisWeek,
      thisMonth: this.cartsQuery.thisMonth,
      thisYear: this.cartsQuery.thisYear,
      specificYear: this.cartsQuery.specificYear,
      startDate: this.cartsQuery.startDate,
      endDate: this.cartsQuery.endDate
    };
    const buyers = this.cartService.filterSoldCarts(this.allBuyers, filterCriteria);
    this.allFileterdBuyers = buyers;
    this.buyers = buyers;
    this.loadDevices();
  }

  resetFilter():void {
    this.cartsQuery = {
      category: '',
      payType: '',
      buyerType: '',
      sellerName: '',
      today: false,
      thisMonth: false,
      thisYear: false,
      thisWeek: false,
      specificYear: '',
      status: '',
      startDate: '',
      endDate: ''
    }

    this.filterCarts();
  }
}
