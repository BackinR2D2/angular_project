import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-person-modal',
  templateUrl: './person-modal.component.html'
})
export class PersonModalComponent implements OnInit {
  @Input() id_person: number | undefined;

  modal = {} as any;
  cars = [] as any;
  dropDownSettings = {
    clearAllText: "Reset",
    clearable: false,
    closeOnSelect: false,
    loading: false,
    loadingText: "Incarcare masini",
    maxSelectedItems: 10,
    multiple: true,
    notFoundText: "Nicio masina gasita",
    placeholder: "Selecteaza masini",
    searchable: true,
    virtualScroll: true
  };

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    axios.get(`/api/car/`).then((resp) => {
        this.cars = resp.data;
    });
    if (this.id_person) {
      this._spinner.show();
      axios.get(`/api/person/${this.id_person}`).then(async ({ data }) => {
        this.modal = {...data, id_person: this.id_person };
        this._spinner.hide();
      }).catch(() => this.toastr.error('Eroare la preluarea persoanei!'));
    }
  }

  save(): void {
    this._spinner.show();

    if (!this.id_person) {        
      if(Object.values(this.modal).length !== 5) {
            this._spinner.hide();
            this.toastr.error('Unele campuri incomplete');
            this.activeModal.close();
            return;
      } else {
        axios.post('/api/person', this.modal).then(() => {
            this._spinner.hide();
            this.toastr.success('Persoana a fost salvată cu succes!');
            this.activeModal.close();
        }).catch(() => this.toastr.error('Eroare la salvarea persoanei!'));
      }
    } else {
      axios.put('/api/person', this.modal).then(() => {
        this._spinner.hide();
        this.toastr.success('Persoana a fost modificată cu succes!');
        this.activeModal.close();
      }).catch(() => this.toastr.error('Eroare la modificarea persoanei!'));
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
