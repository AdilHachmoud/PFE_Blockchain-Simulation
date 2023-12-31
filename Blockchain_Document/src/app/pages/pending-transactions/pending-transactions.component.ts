import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BlockchainService } from '../../services/blockchain.service';

@Component({
  selector: 'app-pending-transactions',
  templateUrl: './pending-transactions.component.html',
  styleUrls: ['./pending-transactions.component.scss']
})
export class PendingTransactionsComponent implements OnInit {
  public pendingTransactions = [];
  public miningInProgress = false;
  public justAddedTx = false;

  constructor(private http: HttpClient,private blockchainService: BlockchainService, private router: Router, private route: ActivatedRoute) {
    this.blockchainService.retrieve();
    this.pendingTransactions = blockchainService.getPendingTransactions();
  }

  ngOnInit() {
    if (this.route.snapshot.paramMap.get('addedTx')) {
      this.justAddedTx = true;

      setTimeout(() => {
        this.justAddedTx = false;
      }, 4000);
    }
  }

  minePendingTransactions() {
    this.miningInProgress = true;
    this.blockchainService.minePendingTransactions();
    this.blockchainService.RetrieveB();
    this.blockchainService.RetrieveTr();
    setTimeout(() => {this.blockchainService.mixBT();},1000);
    setTimeout(() => { this.miningInProgress = false;this.router.navigate(['/'])},2000);

  }
}
