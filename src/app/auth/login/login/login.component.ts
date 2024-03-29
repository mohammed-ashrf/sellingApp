import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { User } from '../../user';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  loginAttempted!: boolean;
  loginNotSuccessfull: boolean = false;
  showPassword:boolean = false;

  users:any;
  currentUser: any;
  user!: User;
  id:any;
  username:any;
  role: any;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getUsers();
    const currentUser = localStorage.getItem('user'); 
    if (currentUser) {
      const token = this.authService.getToken();
      if (token !== '') {
        this.whichUser(token).subscribe((page) => {
          this.router.navigate([page]);
        });
      }
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  getUsers() {
    this.authService.getUsers().subscribe(
      (users) => {
        this.users = users;
      }
    )
  }

  
  whichUser(token: any): Observable<string> {
    return this.authService.getUser(token).pipe(
      map((userInfo) => {
        this.currentUser = userInfo;
        const id = this.currentUser?.user?.id;
        const user = this.users.find((u: { _id: any; }) => u._id === id);
        if (user) {
          this.user = user;
          this.username = this.user.username;
          this.role = this.user.role;
          const { password, ...logedUser } = user;
          localStorage.setItem("user", JSON.stringify(logedUser));
          console.log(this.role);
          if (this.role === 'receiver') {
            return '/devices';
          } else if (this.role === 'admin') {
            return '/admin';
          }
        }
        return '/login';
      }),
      catchError(error => {
        console.log(error);
        return of('/login');
      })
    );
  };

  submit(): void {
    this.loginAttempted = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (data) => {
        this.loginAttempted = false;
        this.authService.setToken(data.token);
        this.whichUser(data.token).subscribe((page) => {
          this.router.navigate([page]);
        });
        this.email = '';
        this.password = '';
      },
      error: (error) => {
        console.error(error);
        this.loginNotSuccessfull = true;
        this.email = '';
        this.password = '';
      }
    });
  };
}
