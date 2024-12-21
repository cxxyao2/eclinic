import { Component } from '@angular/core';

@Component({
  selector: 'app-inpatient-admit',
  standalone: true,
  imports: [],
  templateUrl: './inpatient-admit.component.html',
  styleUrl: './inpatient-admit.component.scss'
})
export class InpatientAdmitComponent {

  // todo: 1, 展示所有房间的使用情况. 一个护士管理4个房间, 16个床位
  // 2, 默认1个房间4张床位, 可以分配新病人到空床位
  // 3，可以在不同房间内拖动.只有有空床
}
