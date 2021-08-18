import { HttpParams } from '@angular/common/http';
import { Component, OnInit, Optional, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { RecoverComponent } from '../recoverPassword/recoverpassword.component';
import { RegisterComponent } from '../register/register.component';


@Component({
    selector: 'ngx-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
  })


  export class LoginComponent implements OnInit {
    
    firstFormGroup: FormGroup;

    showPassword = false;

    canPressButton: boolean = false;

    siteKey:any;
    size: any;

    dialogref: any;

    dialog: boolean = true;

    constructor(private fb: FormBuilder, private authService: AuthService, 
            @Optional() protected ref: NbDialogRef<LoginComponent>, private dialogService: NbDialogService,
                private router: Router){
      


                  console.log(this.ref)
      if(this.ref == null){
        
        this.router.navigateByUrl('/pages/dashboard')
        this.dialog = false;
      }else{
        this.size = '5%'
        this.siteKey = '6Letx3UbAAAAACfr6czxCySSm9Aop4E0qPFZ9K72'
        this.firstFormGroup = this.fb.group({
          correo: ['', Validators.required],
          pass: ['', Validators.required],
          recaptcha: ['', Validators.required]
        });
      }
      
    }

    ngOnInit(): void {

    }

    getInputType() {
      if (this.showPassword) {
        return 'text';
      }
      return 'password';
    }

    toggleShowPassword() {
      this.showPassword = !this.showPassword;
      
    }
    handleExpire(){
      this.canPressButton = false
    }
    handleSuccess(event){
      this.canPressButton = true;
    }

    checkLogin(){

      if(this.canPressButton){
        let correo = this.firstFormGroup.controls['correo'].value
        let pass = this.firstFormGroup.controls['pass'].value



        const payload = new HttpParams()
        .set('correo',JSON.stringify(correo))
        .set('pass',JSON.stringify(pass))
        
        
        

        this.authService.login(payload).subscribe((resp:any)=>{

         
            Swal.fire({
              icon: 'success',
              title: 'Inicio de sesión exitoso.',
              text: 'Tus credenciales han sido validadas correctamente.',
              showConfirmButton: false,
              timer: 2000
            }).then((result2)=>{

              //
              localStorage.setItem('token', resp.token)

              
              //localStorage.setItem('type',resp.token.tipo)

              window.location.reload()
              
            })
        },(err:any)=>{
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error...',
            text: err.error.name,
            showConfirmButton: true
          })
        })

      }
      

    }

    openRecovery(){
      this.ref.close()

      this.dialogref = this.dialogService.open(RecoverComponent);
    }

    openRegister(){
      this.ref.close()

      this.dialogref = this.dialogService.open(RegisterComponent);
    }
  }