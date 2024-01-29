import { Component, OnInit } from '@angular/core';
import { Receive, Query } from 'src/app/shared/recieve';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user';
import { Buyer, CartService } from 'src/app/services/cart.service';
import { ProductsQuery } from 'src/app/shared/products';
import { ProductSection } from 'src/app/shared/information';
import { InformationService } from 'src/app/services/information.service';
@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
})
export class DeviceListComponent implements OnInit {
  buyers: Buyer[] = [];
  allBuyers: Buyer[] = [];
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
  user!: User;
  id:any;
  username:any;
  token:any;
  page: number = 0;
  itemToload: number = 0;
  permissions :Record<string, boolean> = {
    'informations': false,
    'expenses': false,
    'losses': false,
    'soldCarts': false,
  };
  constructor(private cartService: CartService,
    private authService: AuthService,
    private informationService: InformationService,
    ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    localStorage.setItem("location", "devices");
    const currentUser = localStorage.getItem('user'); 
    if (currentUser) {
      this.user = JSON.parse(currentUser);
      this.user.access.forEach((item: string) => {
        if(this.authService.isLoggedIn() && this.authService.hasAccess(item)){
          this.permissions[item] = true;
        }
      });
      this.getBuyers();
      this.getUsers()
      this.loadOnScroll();
    }
  }

  getUsers() {
    this.authService.getUsers().subscribe(
      (users) => {
        this.users = users;
      }
    )
  }

  loadOnScroll() {
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