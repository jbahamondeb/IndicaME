import { Component, ElementRef, OnInit, Optional, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient,HttpErrorResponse, HttpHeaders, HttpBackend, HttpParams} from '@angular/common/http';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { NbDialogRef } from '@nebular/theme';
import { Router } from '@angular/router';




@Component({
    selector: 'ngx-recover',
    templateUrl: './recoverpassword.component.html',
    styleUrls: ['./recoverpassword.component.scss']
  })

export class RecoverComponent implements OnInit {
    firstFormGroup: FormGroup;

    showPassword = false;
    showPassword2 = false;
    dialog: boolean = true;


    noCorreo: boolean = true;
    incorrectCorreo: boolean = false;

    noPass: boolean = true;
    noPass2: boolean = true;
    incorrectPassLength: boolean = false;
    incorrectPassNumber: boolean = false;
    incorrectPassSpecial: boolean = false;
    incorrectPassUpper: boolean = false;

    notEquals: boolean = false;

    validForm:boolean = false;

    loading: boolean = false;

    constructor(private fb: FormBuilder, private authSerice: AuthService,
      @Optional() protected ref: NbDialogRef<RecoverComponent>, private router: Router){

        if(this.ref == null){
        
          this.router.navigateByUrl('/pages/dashboard')
          this.dialog = false;
        }else{
          this.firstFormGroup = this.fb.group({
            correo: ['', Validators.required],
            pass: ['', Validators.required],
            pass2: ['', Validators.required]
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
  

      getInputType2() {
        if (this.showPassword2) {
          return 'text';
        }
        return 'password';
      }
  
      toggleShowPassword2() {
        this.showPassword2 = !this.showPassword2;
        
      }

      change(event, tipo){
        let texto = event.target.value 
       
        if(tipo == 'correo'){
          if(texto == ''){
            this.noCorreo = true;
          }else{
            this.noCorreo = false;
            const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
          
          
            this.incorrectCorreo = !regularExpression.test(String(texto).toLowerCase())
      
            
          }
        }else if(tipo == 'pass'){
          
          if(texto == ''){
            this.noPass = true;
          }else{
            this.noPass = false;

            if(texto.length < 8){
              this.incorrectPassLength = true;
            }else{
              this.incorrectPassLength = false;
            }

            const regularExpression2 = /[A-Z]/;

            let test_1 = regularExpression2.test(String(texto))
            if(test_1 == true){
              this.incorrectPassUpper = false;
            }else{
              this.incorrectPassUpper = true;
            }

            const regularExpression3 = /[0-9]/;


            let test_2 = regularExpression3.test(String(texto))

            if(test_2 == true){
              this.incorrectPassNumber = false;
            }else{
              this.incorrectPassNumber = true;
            }


            
            
            //const regularExpression4 = /^(?=.*[])(?=.*\d)(?=.*[@$!%*#?&])[\d@$!%*#?&]{8,}$/;
            const regularExpression4 = new RegExp('^(?=.*[!@#$%^&*"\\[\\]\\{\\}<>/\\(\\)=\\\\\\-_´+`~\\:;,\\.€\\|])')
            let test_3 = regularExpression4.test(String(texto))

            if(test_3 == true){
              this.incorrectPassSpecial = false;
            }else{
              this.incorrectPassSpecial = true;
            }
          }
  
        }else if(tipo == 'pass2'){
          if(texto == ''){
            this.noPass2 = true;
          }else{
            this.noPass2 = false;
            let new_pass = this.firstFormGroup.controls['pass'].value;
    
            if(texto !== new_pass){
              this.notEquals = true;
            }else{
              this.notEquals = false;
            }
          }
          
        }
    }

    solicitarCambio(){

      if(!this.noPass 
        && !this.incorrectPassLength && !this.incorrectPassNumber && !this.incorrectPassSpecial 
        && !this.incorrectPassUpper && !this.noCorreo && !this.incorrectCorreo
        ){
            this.validForm = true;
        }else{
          this.validForm = false;
        }

      if(this.validForm){
        
        Swal.fire({
          title: '¿Estás seguro de solicitar el cambio de contraseña?',
          icon: 'warning',
          text: 'Para confirmar el cambio, se te enviará un correo de confirmación',
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: `Si`,
          denyButtonText: `Cancelar`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
              this.loading = true;
              let correo = this.firstFormGroup.controls['correo'].value
              let pass = this.firstFormGroup.controls['pass'].value 
              let pass2 = this.firstFormGroup.controls['pass2'].value

              const payload = new HttpParams()
              .set('correo',JSON.stringify(correo))
              .set('pass',JSON.stringify(pass))
              

              this.authSerice.recoverPassword(payload).subscribe((resp:any)=>{
                this.loading = false;

                Swal.fire({
                  icon: 'success',
                  title: 'Solicitud de cambio de contraseña realizada con éxito!',
                  text:'Su solicitud fue enviada con éxito. Por favor revise su correo. Gracias!',
                  showConfirmButton: false,
                  timer: 3600
                })
                this.ref.close()
              },(err:any)=>{
                this.loading = false;
                Swal.fire({
                  icon: 'error',
                  title: 'Ha ocurrido un error...',
                  text: err.error.name,
                  showConfirmButton: true
                })
                
              })


          } 
        })
      }
      
    }
}