import { Component, EventEmitter, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {ArchivosService} from '../../archivos.service'

import Swal from 'sweetalert2'
import { NbStepperComponent } from '@nebular/theme';
import { NbDialogRef } from '@nebular/theme';


import { EditService } from '../../../edit/edit.service';
import { Subject } from 'rxjs';


import { SearchServiceService } from '../../search-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss']
})
export class AddFileComponent implements OnInit {




  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  selectedGranularidad = '';

  radioGroupValue = 1;
  anyoMinimo: any = 1;

  oneyear: boolean;
  interval: boolean;
  moreyears:boolean;

  anyoinicial: any;
  anyofinal: any;

  unanyo:any;

  archivo: any;


  id_indicador:any;

  flag: boolean;


  cantNext: boolean = false;

  cargandoArchivo: boolean = true;
  error : boolean = false;

  allGood: boolean = false;


  dialog: boolean = true;
  @ViewChild('stepper') stepperComponent: NbStepperComponent;

  
  
  constructor(private fb: FormBuilder, private archivoService: ArchivosService, 
              @Optional() protected ref: NbDialogRef<AddFileComponent>,
              private ss: SearchServiceService, private router: Router) {


                if(this.ref == null){
        
                  this.router.navigateByUrl('/pages/dashboard')
                  this.dialog = false;
                }

               }
    
  ngOnInit(): void {


    
    this.firstFormGroup = this.fb.group({
      granularidad: ['', Validators.required],
      anyo_in:['', Validators.required],
      anyo_fin:['', Validators.required],
      anyo_solo:['', Validators.required],
    });

    this.secondFormGroup = this.fb.group({
      campoGranularidad: ['', Validators.required],
      campoFecha: ['', Validators.required],
      archivo: ['', Validators.required],
    });



    this.oneyear = false;
    this.interval = true;
    this.moreyears = false;

    this.firstFormGroup.controls['anyo_solo'].setValue("")

    this.secondFormGroup.controls['campoFecha'].setValue("")

    this.cantNext = true;
  }

  onChangeAnyo(event:any){
    this.anyoMinimo = event;


    if(this.anyoMinimo == 1){
      this.oneyear = false;
      this.interval = true;
      this.moreyears = false;

      this.firstFormGroup.controls['anyo_solo'].setValue("")
    }else if(this.anyoMinimo == 2){
      this.oneyear = true;
      this.interval = false;
      this.moreyears = false;

      this.firstFormGroup.controls['anyo_in'].setValue("")
      this.firstFormGroup.controls['anyo_fin'].setValue("")
    }else if(this.anyoMinimo == 3){
      this.oneyear = false;
      this.interval = false;
      this.moreyears = true;

      this.firstFormGroup.controls['anyo_solo'].setValue("")
      this.firstFormGroup.controls['anyo_in'].setValue("")
      this.firstFormGroup.controls['anyo_fin'].setValue("")
    }
    

  }

  atras(){
    
    if(this.anyoMinimo == 1){
      this.oneyear = false;
      this.interval = true;
      this.moreyears = false;

      this.firstFormGroup.controls['anyo_solo'].setValue("")
    }else if(this.anyoMinimo == 2){
      this.oneyear = true;
      this.interval = false;
      this.moreyears = false;

      this.firstFormGroup.controls['anyo_in'].setValue("")
      this.firstFormGroup.controls['anyo_fin'].setValue("")
    }else if(this.anyoMinimo == 3){
      this.oneyear = false;
      this.interval = false;
      this.moreyears = true;

      this.firstFormGroup.controls['anyo_solo'].setValue("")
      this.firstFormGroup.controls['anyo_in'].setValue("")
      this.firstFormGroup.controls['anyo_fin'].setValue("")
    }
  }

  onFileChangeChecker(event:any){

    this.archivo = event.target.files[0]

    if(this.archivo){
      let nombre_archivo = event.target.files[0].name


      const formData = new FormData();
      formData.append('nombre_archivo', nombre_archivo);

      this.archivoService.existName(formData).subscribe((resp:any)=>{
        if(resp.result.length > 0){
          this.cantNext = false;
        }else{
          this.cantNext = true;
        }
        
      },(err:any)=>{
        this.cantNext = false;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error...',
          text: err.error.name,
          showConfirmButton: true
        })
      })
    }else{
      this.cantNext = true;
    }
    

    
  }

  onSubmit1(){
    if(this.anyoMinimo == 1){
      this.oneyear = false;
      this.interval = true;
      this.moreyears = false;

      this.firstFormGroup.controls['anyo_solo'].setValue("-1")
    }else if(this.anyoMinimo == 2){
      this.oneyear = true;
      this.interval = false;
      this.moreyears = false;

      this.firstFormGroup.controls['anyo_in'].setValue("-1")
      this.firstFormGroup.controls['anyo_fin'].setValue("-1")
    }else if(this.anyoMinimo == 3){
      this.oneyear = false;
      this.interval = false;
      this.moreyears = true;

      this.firstFormGroup.controls['anyo_solo'].setValue("-1")
      this.firstFormGroup.controls['anyo_in'].setValue("-1")
      this.firstFormGroup.controls['anyo_fin'].setValue("-1")
    }

    this.stepperComponent.next()
    
  }

  processFile(){
    
    
    if(this.cantNext){
      this.cargandoArchivo = true;
      const formData = new FormData();
  
      let granularidad, anyo_in, anyo_fin, anyo_solo,campoGranularidad, campoFecha: any;
  
      granularidad = this.firstFormGroup.get('granularidad').value
      anyo_in = this.firstFormGroup.get('anyo_in').value
      anyo_fin = this.firstFormGroup.get('anyo_fin').value
      anyo_solo = this.firstFormGroup.get('anyo_solo').value
      campoGranularidad = this.secondFormGroup.get('campoGranularidad').value
      campoFecha = this.secondFormGroup.get('campoFecha').value
      
      formData.append('file', this.archivo);
      formData.append('granularidad', granularidad);
      formData.append('anyo_in', anyo_in);
      formData.append('anyo_fin', anyo_fin);
      formData.append('anyo_solo', anyo_solo);
      formData.append('campoGranularidad', campoGranularidad);
      formData.append('campoFecha', campoFecha);
      formData.append('id_indicador',this.id_indicador)
      
  
  
  
      this.archivoService.processFile(formData).subscribe((resp:any)=>{
        this.cargandoArchivo = false;
        this.error = false;
        
  
        
        
        
        Swal.fire({
          icon: 'success',
          title: resp.response,
          text: 'El archivo fue subido y leído correctamente.',
         
        }).then(()=> {
          this.allGood = true;
          this.ref.close();
          if(this.flag == true){
            this.ss.emitConfig(true)
          }else{
            window.location.reload()
          }
          
        });
  
        
  
        
        
      },(err)=>{
        this.cargandoArchivo = false
  
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error...',
          text: err.error.name,
          showConfirmButton: true
        })
        this.stepperComponent.previous()
        this.error = true;
  
        //this.stepperComponent.previous()
  
        this.allGood = false;
        
        
      })
    }
    

  }

  indirectTasksHasCompleted(){

  }

  cerrarDialog(){
    Swal.fire({
      title: '¿Estás seguro de no añadir un archivo?',
      showCancelButton: true,
      confirmButtonText: `Si.`,
      denyButtonText: `No.`,
      cancelButtonText: `Cancelar.`
    }).then((result3)=>{
      if(result3.isConfirmed){
        this.ref.close()
          
      }
    })
    
  }

}
