import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-car-modal',
  templateUrl: './car-modal.component.html'
})
export class CarModalComponent implements OnInit {
  @Input() id_car: number | undefined;

  modal = {} as any;

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (this.id_car) {
      this._spinner.show();
      axios.get(`/api/car/${this.id_car}`).then(async ({ data }) => {
        this.modal = data;
        this._spinner.hide();
      }).catch(() => this.toastr.error('Eroare la preluarea persoanei!'));
    }
  }

  save(): void {
    this._spinner.show();
    
    if(Object.values(this.modal).length !== 5) {
        this._spinner.hide();
        this.toastr.error('Unele campuri incomplete');
        this.activeModal.close();
        return;
    } 

    if (!this.id_car) {
      axios.post('/api/car', this.modal).then(() => {
        this._spinner.hide();
        this.toastr.success('Masina a fost salvată cu succes!');
        this.activeModal.close();
      }).catch(() => this.toastr.error('Eroare la salvarea masinii!'));
    } else {
      axios.put('/api/car', this.modal).then(() => {
        this._spinner.hide();
        this.toastr.success('Masina a fost modificată cu succes!');
        this.activeModal.close();
      }).catch(() => this.toastr.error('Eroare la modificarea masinii!'));
    }
  }

  selectSearch(term: string, item: any): boolean {
    const isWordThere = [] as any;
    const splitTerm = term.split(' ').filter(t => t);

    item = REPLACE_DIACRITICS(item.name);

    splitTerm.forEach(term => isWordThere.push(item.indexOf(REPLACE_DIACRITICS(term)) !== -1));
    const all_words = (this_word: any) => this_word;

    return isWordThere.every(all_words);
  }
}
