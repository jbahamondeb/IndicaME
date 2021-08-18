import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService, NbMediaBreakpoint, NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil, takeWhile } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';


import { LoginComponent } from '../../../pages/auth/login/login.component';
import { RegisterComponent } from '../../../pages/auth/register/register.component';
import { AuthService } from '../../../pages/auth/auth.service';

import jwt_decode from 'jwt-decode';
import { HttpParams } from '@angular/common/http';

import { HeaderService } from './header.service';

import { ChangeDetectionStrategy } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'dark';



  loggedIn: boolean = false;


  dialogref: any;

  correo_user: any;
  tipo_user: any;

  info_user:any;

  name_user:any;



  admin = false;

  badgeText: any;

  private alive = true;
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;
  
  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private router: Router,
              private dialogService: NbDialogService,
              private authService: AuthService,
              private headerService:HeaderService) {

                this.breakpoints = this.breakpointService.getBreakpointsMap();
        let local_storage;
        local_storage = localStorage.getItem('token')



       

        if(local_storage == null){
          this.loggedIn = false;
        }else{
          this.loggedIn = true;
        }

        if(local_storage){
          let decode = this.getDecodedAccessToken(local_storage)
        this.tipo_user = decode.tipo

        if(this.tipo_user == 1){
          this.admin = true;
        }
        }

        

        console.log(this.tipo_user)

  }

  ngOnInit() {



    let token = localStorage.getItem('token')
    if(token){
      let decode = this.getDecodedAccessToken(token)

      this.correo_user = JSON.parse(decode.correo);

      //this.tipo_user = decode.tipo

      this.headerService.getNotifications().subscribe((resp:any)=>{
        console.log(resp)
        this.badgeText = resp.result
      },(err:any)=>{
  
      })

      
      const payload = new HttpParams()
      .set('correo',JSON.stringify(this.correo_user))

      this.authService.getUserInfo(payload).subscribe((resp:any)=>{
        
        this.info_user = resp.result[0];

        this.name_user = this.info_user.nombre + " " + this.info_user.apellidop + " " +  this.info_user.apellidom


      },(err:any)=>{

      })
    }
    this.themeService.onMediaQueryChange()
        .pipe(takeWhile(() => this.alive))
        .subscribe(([oldValue, newValue]) => {
            this.breakpoint = newValue;
        });
        

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
    

    
    /*
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
      */


    

  }

  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return true;
  }

  logearse(){
    
    //this.router.navigateByUrl('/pages/auth/login')
    this.dialogref = this.dialogService.open(LoginComponent);
    
  }
  registrarse(){
    this.dialogref = this.dialogService.open(RegisterComponent);
  }
  cerrarSesion(){

    Swal.fire({
      title: 'Estás seguro de cerrar sesión?',
      icon: 'warning',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: `Si`,
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        localStorage.removeItem('token')
        localStorage.removeItem('type')
        Swal.fire({
          icon: 'success',
          title: 'Has cerrado de sesión correctamente.',
          showConfirmButton: false,
          timer: 1500
        }).then((result2)=>{
            this.router.navigateByUrl('/homepage')
            
        })

        
    
    
        
      }
    })
    
   
  }

  menuClick(){
    
  }

  getSolicitudes(){
    console.log("hola")
    this.router.navigateByUrl('/pages/request/newrequests')
  }



  
}
