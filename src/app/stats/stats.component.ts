import { Component, OnInit } from '@angular/core';
import { ChartsService } from '../services/charts.service';
import { CartService, Buyer } from '../services/cart.service';
import { ProductsQuery } from '../shared/products';
import { Receive } from '../shared/recieve';
import { Query } from '../shared/recieve';
import { AuthService } from '../auth/auth.service';
import { InformationService } from '../services/information.service';
import { ProductSection } from '../shared/information';
import { Cart } from '../services/cart.service';
import { ProductsService } from '../services/products.service';
@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  TotalChartUrl!: string;
  profitsChartUrl!: string;
  type: string = 'bar';
  labels: string[] = ['المبيعات', 'الصيانة'];
  datasetsLabel: string = 'الدخل الكلي';
  backgroundColor: string[] = ['rgb(54, 162, 235)', 'rgb(75, 192, 192)'];
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
  }
  buyers: Buyer[] = [];
  sellingMoneyTotal: number = 0;
  ProductBuyingMoney: number = 0;
  sellingMoneyProfites: number = 0;
  sellingMoneyStill: number = 0;

  ReapirMoneyTotal: number = 0;
  ProductsMoneyInRepair: number = 0;
  repairMoneyProfites: number = 0;
  PurchaseProductsMoneyInRepair: number = 0;

  BuyingMoneyTotal: number = 0;
  BuyingMoneyPaid: number = 0;
  BuyingMoneyOwing: number = 0;
  otherExpenses: number = 0;

  allBuyers: Buyer[] = [];

  devices: Receive[] = [];
  deliveredDevices: Receive[] = [];
  allDevices: Receive[] = [];
  inAppDevices: Receive[] = [];
  query: Query = {
    repaired: false,
    paidAdmissionFees: false,
    delivered: true,
    returned: false,
    inProgress: false,
    newDevices: false,
    today: false,
    thisMonth: true,
    thisYear: false,
    specificYear: '',
    engineer: '',
    priority: '',
    startDate: '',
    endDate: ''
  }
  users:any;
  productSections: ProductSection[] = [];
  expensesInputs = [
    {
      name: 'المصروفات العامة',
      value: 0
    },
    {
      name: 'الضرائب',
      value: 0
    },
    {
      name: 'الإجارات',
      value: 0
    }
  ];
  input = {
    name: '',
    value: 0
  }
  constructor(private chartService: ChartsService,
    private cartService: CartService,
    private authService: AuthService,
    private informationService: InformationService,
    private productsService: ProductsService) { }

  ngOnInit() {
    this.getBuyers();
    this.getUsers();
    this.getInformations();
    this.calBuyingmoneyTotal();
    this.calOtherExpenses();
  }

  generateChart(sellingData: number, repairedData:number, type: string, labels: string[], datasetsLabel: string, backgroundColor: string[]) {
    return this.chartService.generateChart(type, labels,datasetsLabel,backgroundColor,sellingData, repairedData);
  }

  addInput() {
    this.expensesInputs.push(this.input);
    this.calOtherExpenses();
    this.input = {
      name: '',
      value: 0
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

  calsellingMoneyTotal(buyers:Buyer[]) {
    this.sellingMoneyTotal = buyers.reduce((total, buyer) => {
      return total + buyer.carts.reduce((subtotal, cart) => {
        return subtotal + cart.paid;
      }, 0);
    }, 0);
  }

  calSellingMoneyStill(buyers: Buyer[]) {
    this.sellingMoneyStill = buyers.reduce((total, buyer) => {
      return total + buyer.carts[buyer.carts.length - 1].pastOwing;
    }, 0);
  }
  calProductBuyingMoney(cart: Cart){
    this.ProductBuyingMoney = cart.products.reduce((subtotal2, product) =>{
      return subtotal2 + (product.quantity * product.product.purchasePrice);
    }, 0);
  }
  calSellingMoneyProfites(buyers: Buyer[]) {
    this.sellingMoneyProfites = this.sellingMoneyTotal - buyers.reduce((total, buyer) => {
      return total + buyer.carts.reduce((subtotal, cart) => {
        this.calProductBuyingMoney(cart);
        return subtotal + this.ProductBuyingMoney;
      }, 0);
    }, 0);
  }

  calRepairMoneyTotal(devices: Receive[]) {
    this.ReapirMoneyTotal = devices.reduce((total, device) => {
      return total + device.total;
    }, 0);
  }

  calProductsMoneyInRepair(devices: Receive[]) {
    this.ProductsMoneyInRepair =  devices.reduce((total, device) => {
      return total + device.productsMoney;
    }, 0);
  }
  calPurchaseProductsMoneyInRepair(devices: Receive[]) {
    this.PurchaseProductsMoneyInRepair = devices.reduce((total, device) => {
      return total + device.products.reduce((subtotal, product) => {
        return subtotal + (product.purchasePrice * product.quantity);
      },0)
    }, 0);
    console.log(this.PurchaseProductsMoneyInRepair);
  }

  calRepairMoneyProfites() {
    this.repairMoneyProfites = this.ReapirMoneyTotal - this.ProductsMoneyInRepair;
  }

  calBuyingmoneyTotal () {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    this.productsService.getAll().subscribe(
      (products) => {
        this.BuyingMoneyPaid = products.reduce((total, product) => {
          return total + product.suppliers.reduce((subTotal, supplier) => {
            const date = new Date(supplier.purchasedate);
            const month = date.getMonth();
            if (month === currentMonth) {
              return subTotal+ supplier.whatIsPaid;
            }else {
              return subTotal;
            };
          }, 0)
        }, 0);

        this.BuyingMoneyOwing = products.reduce((total, product) => {
          return total + product.suppliers.reduce((subTotal, supplier) => {
            const date = new Date(supplier.purchasedate);
            const month = date.getMonth();
            if (month === currentMonth) {
              return subTotal+ supplier.oweing;
            }else {
              return subTotal;
            };
          }, 0)
        }, 0);

        this.BuyingMoneyTotal = this.BuyingMoneyPaid + this.BuyingMoneyOwing;

        console.log(this.BuyingMoneyTotal, this.BuyingMoneyPaid, this.BuyingMoneyOwing);
      }
    )
  }

  calOtherExpenses() {
    this.otherExpenses = this.expensesInputs.reduce((total, input)=> {
      return total + input.value;
    }, 0);
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
      startDate: this.query.startDate,
      endDate: this.query.endDate
    };
    const buyers = this.cartService.filterSoldCarts(this.allBuyers, filterCriteria);
    this.buyers = buyers;
    this.calsellingMoneyTotal(buyers);
    this.calSellingMoneyStill(buyers);
    this.calSellingMoneyProfites(buyers);
    this.TotalChartUrl = this.generateChart(this.sellingMoneyTotal, this.ReapirMoneyTotal, this.type, this.labels,this.datasetsLabel,this.backgroundColor);
    this.profitsChartUrl = this.generateChart(this.sellingMoneyProfites, this.repairMoneyProfites, 'pie', this.labels,'صافي الإيرادات',this.backgroundColor);
  }

  resetCartsFilter():void {
    this.cartsQuery = {
      category: '',
      payType: '',
      buyerType: '',
      sellerName: '',
      today: false,
      thisWeek: false,
      thisMonth: true,
      thisYear: false,
      specificYear: '',
      status: '',
      startDate: '',
      endDate: ''
    }

    this.filterCarts();
  }

  getUsers() {
    this.authService.getUsers().subscribe(
      (users) => {
        this.users = users;
      }
    )
  }

  getInformations() {
    this.informationService.getProductSections().subscribe(
      (productSections) => {
        this.productSections = productSections;
      }
    )
  }
}
