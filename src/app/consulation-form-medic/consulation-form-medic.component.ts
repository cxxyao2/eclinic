import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GetMedicationDTO, MedicationsService } from '@libs/api-client';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-consulation-form-medic',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    AsyncPipe
  ],
  templateUrl: './consulation-form-medic.component.html',
  styleUrl: './consulation-form-medic.component.scss'
})
export class ConsulationFormMedicComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<GetMedicationDTO>([]);
  displayedColumns: string[] = ['no', 'medicationId', 'medicationName', 'dosage', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  allMedications: GetMedicationDTO[] = [];
  filterMedications: Observable<GetMedicationDTO[]>;
  selectedMedication = signal<GetMedicationDTO>({});
  readonly medicationControl = new FormControl<string | GetMedicationDTO>('');
  private medicationService = inject(MedicationsService);
  destroyRef = inject(DestroyRef);


  constructor() {
    this.filterMedications = this.medicationControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.allMedications.slice();
      }),
    );
  }

  ngOnInit(): void {
    this.medicationService.apiMedicationsGet()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => { if (res && res.data) this.allMedications = res.data; },
        error: (err) => console.error(err)
      });

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private _filter(name: string): GetMedicationDTO[] {
    const filterValue = name.toLowerCase();

    return this.allMedications.filter(option => option.name?.toLowerCase().includes(filterValue));
  }


  onMedicationSelected(event: any): void {
    let obj = event.option.value as GetMedicationDTO;
    this.selectedMedication.set(obj);
    const data = [...this.dataSource.data];
    this.dataSource.data = [...data, { ...this.selectedMedication() }];
  }



  applyFilterTable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  displayFn(med: GetMedicationDTO): string {
    return med && med.name ? med.name : '';
  }


  removeMedication(i: number) {
    const data = [...this.dataSource.data];
    const newData = data.splice(i, 1);
    this.dataSource.data = [...newData];
  }

  getMedications(): GetMedicationDTO[] {
    return this.dataSource.data;
  }

  resetMedication(): void {
    this.dataSource.data = [];
  }
}

