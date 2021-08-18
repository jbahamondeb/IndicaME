import { Component, ElementRef, OnInit, Optional, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient,HttpErrorResponse, HttpHeaders, HttpBackend, HttpParams} from '@angular/common/http';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { NbDialogRef } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
    selector: 'ngx-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
  })


  export class RegisterComponent implements OnInit {
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup

    showPassword = false;

    canPressButton: boolean = false;

    siteKey:any;
    size: any;

    dialogref: any;

    numberBad: boolean = false;

    nextForm: boolean = false;

    noCorreo: boolean = true;
    incorrectCorreo: boolean = false;

    noPass: boolean = true;
    incorrectPassLength: boolean = false;
    incorrectPassNumber: boolean = false;
    incorrectPassSpecial: boolean = false;
    incorrectPassUpper: boolean = false;
    incorrectPass: boolean = false;
    incorrectTelefono: boolean = false;

    noName: boolean = true;
    noApellidoP: boolean = true;
    noApellidoM: boolean = true;
    noTelefono: boolean = true;
    noMotivacion:boolean = true;


    validForm:boolean = false;


    loading: boolean = false;


    private http2: HttpClient

    dialog: boolean = true;

    @ViewChild('coverFilesInput') imgType:ElementRef;
    constructor(private fb: FormBuilder,private handler: HttpBackend, private authSerice: AuthService,
            @Optional() protected ref: NbDialogRef<RegisterComponent>, private router: Router){
      
              if(this.ref == null){
                this.router.navigateByUrl('/pages/dashboard')
                  this.dialog = false;
              } else{
                this.siteKey = '6Letx3UbAAAAACfr6czxCySSm9Aop4E0qPFZ9K72'
                this.firstFormGroup = this.fb.group({
                  correo: ['', Validators.required],
                  pass: ['', Validators.required],
                  nombre: ['', Validators.required],
                  apellidoP: ['', Validators.required],
                  apellidoM: ['', Validators.required],
                });
          
                this.secondFormGroup = this.fb.group({
                  motivacion: ['', Validators.required],
                  telefono: ['', Validators.required],
                  recaptcha: ['', Validators.required]
                });
          
                this.http2 = new HttpClient(handler)
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

    validate(phone) {
      var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
      
      if (regex.test(phone)) {
          this.numberBad = true;
      } else {
          this.numberBad = false;
      }
    }

    next(){

      if(!this.noName && !this.noApellidoP && !this.noApellidoM && !this.noPass 
          && !this.incorrectPassLength && !this.incorrectPassNumber && !this.incorrectPassSpecial 
          && !this.incorrectPassUpper && !this.noCorreo && !this.incorrectCorreo){
            
            this.nextForm = true;
          }
      
    }

    prev(){
      if(!this.noTelefono && !this.incorrectTelefono && !this.noMotivacion){
        this.nextForm = false;
      }
      
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

      }else if(tipo == 'nombre'){
        if(texto == ''){
          this.noName = true;
        }else{
          this.noName = false;
        }
      }else if(tipo == 'apellidoP'){
        if(texto == ''){
          this.noApellidoP = true;
        }else{
          this.noApellidoP = false;
        }
      }else if(tipo == 'apellidoM'){
        if(texto == ''){
          this.noApellidoM = true;
        }else{
          this.noApellidoM = false;
        }
      }else if(tipo == 'telefono'){
        if(texto == ''){
          this.noTelefono = true;
        }else{
          this.noTelefono = false;
          var regexTelefono = /^(\+?56)?(\s?)(0?9)(\s?)[9876543]\d{7}$/;
          
          let test_phone = regexTelefono.test(texto)

          if (test_phone == true) {
            this.incorrectTelefono = false;
          }else {
            this.incorrectTelefono = true;
          }

        }
      }else if(tipo == 'motivacion'){
        if(texto == ''){
          this.noMotivacion = true;
        }else{
          this.noMotivacion = false;
        }
        
      }
  }


  newSolicitud(){

    if(!this.noName && !this.noApellidoP && !this.noApellidoM && !this.noPass 
      && !this.incorrectPassLength && !this.incorrectPassNumber && !this.incorrectPassSpecial 
      && !this.incorrectPassUpper && !this.noCorreo && !this.incorrectCorreo && !this.noTelefono
      && !this.noMotivacion && this.canPressButton){
          this.validForm = true;
      }else{
        this.validForm = false;
      }
    
    
    if(this.validForm){
      this.loading = true;

      let correo_user = this.firstFormGroup.controls['correo'].value
      let pass_user = this.firstFormGroup.controls['pass'].value
      let nombre_user = this.firstFormGroup.controls['nombre'].value 
      let apellidoP = this.firstFormGroup.controls['apellidoP'].value 
      let apellidoM = this.firstFormGroup.controls['apellidoM'].value 
      let motivacion = this.secondFormGroup.controls['motivacion'].value 
      let telefono = this.secondFormGroup.controls['telefono'].value

      const payload = new HttpParams()
      .set('correo',JSON.stringify(correo_user))
      .set('pass',JSON.stringify(pass_user))
      .set('nombre',JSON.stringify(nombre_user))
      .set('apellidop',JSON.stringify(apellidoP))
      .set('apellidom',JSON.stringify(apellidoM))
      .set('motivacion',JSON.stringify(motivacion))
      .set('telefono',JSON.stringify(telefono))
      
      
      this.authSerice.newRequest(payload).subscribe((resp:any)=>{
        console.log(resp)
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Solicitud enviada con éxito!',
          text:'Su solicitud fue enviada con éxito y ahora debe ser aprobada. Por favor mantenete atento a tu correo. Gracias!',
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
      
      //let headers = new Headers({'authorization': 'Client-ID clientid'});
    }
    

  }

}