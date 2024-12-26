import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";

export interface DialogData {
  title: string;
  content: string | Array<Record<string, any>>;
  isCancelButtonVisible: boolean;
  optionId?: string;
  optionValue?: string;
}


@Component({
  selector: 'dialog-simple-dialog',
  templateUrl: 'dialog-simple-dialog.html',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    ReactiveFormsModule,
  ],
})
export class DialogSimpleDialog implements OnInit {
  itemsControl: FormControl = new FormControl(null);
  form: FormGroup = new FormGroup({
    items: this.itemsControl,
  });

  readonly dialogRef = inject(MatDialogRef<DialogSimpleDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  isArray = signal<boolean>(false);
  listData = signal<Array<any>>([]);

  ngOnInit(): void {
    if (Array.isArray(this.data.content)) {
      this.isArray.set(true);
      this.listData.set([...this.data.content]);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getSelectedOption(): any {
    const selectedId = this.itemsControl.value;
    let returnObj: Record<string, any> | null | undefined = null;
    if (Array.isArray(this.data.content) && this.data.optionId && this.data.optionValue && selectedId && selectedId.length > 0) {
      returnObj = this.data.content?.find(
        (item: any) => item[this.data.optionId!] === selectedId[0]
      );
    }
    return returnObj ?? 'Confirm';
  }
}

