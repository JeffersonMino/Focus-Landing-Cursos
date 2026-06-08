import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LANDING_CONFIG } from '../config/landing.config';
import { PaymentProvider } from '../models/landing.model';
import { environment } from '../../../environments/environment';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'requires_configuration';

export interface PaymentCustomer {
  name: string;
  email: string;
  phone?: string;
}

export interface PaymentCreatePayload {
  provider: PaymentProvider;
  planId: string;
  customer: PaymentCustomer;
}

export interface PaymentCreateResponse {
  id: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: 'USD';
  checkoutUrl?: string;
  qrImageUrl?: string;
  instructions: string[];
  message?: string;
  paidAt?: string;
}

export interface PaymentStatusResponse {
  id: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: 'USD';
  message?: string;
  paidAt?: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}${LANDING_CONFIG.payments.apiPath}`;

  /**
   * <create-payment>
   *   <purpose>Crea una intencion de pago; el backend decide monto, proveedor y URLs finales.</purpose>
   *   <security>No enviar precio desde Angular para evitar manipulacion en navegador.</security>
   * </create-payment>
   */
  createPayment(payload: PaymentCreatePayload): Promise<PaymentCreateResponse> {
    return firstValueFrom(this.http.post<PaymentCreateResponse>(this.endpoint, payload));
  }

  /**
   * <payment-status>
   *   <purpose>Consulta el estado confirmado por backend/webhook despues de abrir DeUna o PayPal.</purpose>
   * </payment-status>
   */
  getStatus(paymentId: string): Promise<PaymentStatusResponse> {
    return firstValueFrom(
      this.http.get<PaymentStatusResponse>(`${this.endpoint}/${encodeURIComponent(paymentId)}/status`)
    );
  }
}
