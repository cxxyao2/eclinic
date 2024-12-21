import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";

export interface DialogData {
  title: string;
  content: string;
  isCancelButtonVisible: boolean;
}


@Component({
  selector: 'dialog-simple-dialog',
  templateUrl: 'dialog-simple-dialog.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule
  ],
})
export class DialogSimpleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogSimpleDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }
}

