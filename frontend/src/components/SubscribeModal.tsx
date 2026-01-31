import { useCallback, useEffect, useRef, useState } from 'react';
import '../assets/styles/subscribe-modal.css';

declare global {
  interface Window {
    PaymentIntegration?: {
      init: (cfg: { terminalKey: string; product: string; features: { iframe: Record<string, unknown> } }) => Promise<{
        iframe: { create: (id: string, opts: Record<string, unknown>) => Promise<{ mount: (el: HTMLElement, url: string) => Promise<void> }> };
      }>;
    };
  }
}

export type TariffForModal = {
  id: string;
  title: string;
  border: string;
  level: 'BASE' | 'EXTENDED' | 'PREMIUM';
};

type Props = {
  open: boolean;
  onClose: () => void;
  tariff: TariffForModal | null;
};

function loadTBankScript(): Promise<void> {
  if (typeof window !== 'undefined' && window.PaymentIntegration) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://integrationjs.tbank.ru/integration.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Не удалось загрузить скрипт Т-Банк'));
    document.body.appendChild(s);
  });
}

export function SubscribeModal({ open, onClose, tariff }: Props) {
  const [type, setType] = useState<'individual' | 'team'>('individual');
  const [phone, setPhone] = useState('');
  const [teamWord, setTeamWord] = useState('');
  const [paymentPhase, setPaymentPhase] = useState<'form' | 'loading' | 'iframe' | 'error'>('form');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const resetForm = useCallback(() => {
    setType('individual');
    setPhone('');
    setTeamWord('');
    setPaymentPhase('form');
    setPaymentError(null);
    if (containerRef.current) containerRef.current.innerHTML = '';
  }, []);

  const close = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEffect(() => {
    if (!open) resetForm();
  }, [open, resetForm]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const modalEl = modalRef.current ?? document.querySelector('.subscribe-modal') as HTMLDivElement | null;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!modalEl || !modalEl.contains(e.target as Node)) return;
      const max = modalEl.scrollHeight - modalEl.clientHeight;
      if (max <= 0) return;
      const next = Math.max(0, Math.min(max, modalEl.scrollTop + e.deltaY));
      modalEl.scrollTop = next;
    };
    const onTouch = (e: TouchEvent) => e.preventDefault();
    const opts = { passive: false, capture: true };
    document.addEventListener('wheel', onWheel, opts);
    document.addEventListener('touchmove', onTouch, opts);
    return () => {
      document.removeEventListener('wheel', onWheel, opts);
      document.removeEventListener('touchmove', onTouch, opts);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const handlePay = async () => {
    if (!tariff) return;
    const level = tariff.level;
    const subscriptionType = type;

    if (subscriptionType === 'individual') {
      const p = phone.trim();
      if (!p) {
        setPaymentError('Введите номер телефона');
        return;
      }
    } else {
      const w = teamWord.trim();
      if (!w) {
        setPaymentError('Введите слово для команды');
        return;
      }
    }

    setPaymentError(null);
    setPaymentPhase('loading');

    const payload: Record<string, string> = {
      subscription_level: level,
      subscription_type: subscriptionType,
    };
    if (subscriptionType === 'individual') payload.phone_number = phone.trim();
    else payload.team_word = teamWord.trim();

    try {
      const initRes = await fetch('/api/tbank/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const initData = await initRes.json().catch(() => ({}));

      if (!initRes.ok) {
        setPaymentPhase('error');
        setPaymentError(initData.detail || initData.error || `Ошибка ${initRes.status}`);
        return;
      }

      const paymentUrl = initData.PaymentURL;
      if (!paymentUrl) {
        setPaymentPhase('error');
        setPaymentError('Не получена ссылка на оплату');
        return;
      }

      await loadTBankScript();

      const cfgRes = await fetch('/api/tbank/config');
      const cfg = await cfgRes.json();
      const terminalKey = cfg.terminalKey || '';

      const initConfig = {
        terminalKey,
        product: 'eacq',
        features: { iframe: {} },
      };

      const integration = await window.PaymentIntegration!.init(initConfig);
      const mainPaymentIntegration = await integration.iframe.create('main-integration', {});

      const container = containerRef.current;
      if (!container) throw new Error('Контейнер оплаты недоступен');
      container.innerHTML = '';
      setPaymentPhase('iframe');
      await mainPaymentIntegration.mount(container, paymentUrl);
    } catch (e) {
      setPaymentPhase('error');
      setPaymentError(e instanceof Error ? e.message : 'Не удалось открыть форму оплаты');
    }
  };

  if (!open) return null;

  const accent = tariff?.border ?? '#009EDC';

  return (
    <div className="subscribe-overlay" onClick={(e) => e.target === e.currentTarget && close()} role="presentation">
      <div
        ref={modalRef}
        className="subscribe-modal"
        style={{ ['--subscribe-accent' as string]: accent }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscribe-modal-title"
      >
        <div className="subscribe-modal-header">
          <span id="subscribe-modal-title">Оформить — {tariff?.title ?? ''}</span>
          <button type="button" className="subscribe-modal-close" onClick={close} aria-label="Закрыть">
            ×
          </button>
        </div>

        {paymentPhase === 'form' && tariff && (
          <>
            <div className="subscribe-type-tabs">
              <button
                type="button"
                className={`subscribe-type-btn ${type === 'individual' ? 'active' : ''}`}
                onClick={() => setType('individual')}
              >
                Индивидуальная подписка
              </button>
              <button
                type="button"
                className={`subscribe-type-btn ${type === 'team' ? 'active' : ''}`}
                onClick={() => setType('team')}
              >
                Командная подписка
              </button>
            </div>

            {type === 'individual' && (
              <div className="subscribe-form-block">
                <h4>Номер телефона</h4>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="79001234567"
                />
              </div>
            )}

            {type === 'team' && (
              <div className="subscribe-form-block">
                <h4>Слово для команды</h4>
                <input
                  type="text"
                  value={teamWord}
                  onChange={(e) => setTeamWord(e.target.value)}
                  placeholder="Слово команды"
                />
              </div>
            )}

            {paymentError && <p className="subscribe-payment-error">{paymentError}</p>}

            <button type="button" className="subscribe-pay-btn" onClick={handlePay}>
              Оплатить
            </button>
          </>
        )}

        {(paymentPhase === 'loading' || paymentPhase === 'iframe') && (
          <div className="subscribe-payment-wrap">
            {paymentPhase === 'loading' && (
              <p className="subscribe-payment-loading">Инициализация оплаты…</p>
            )}
            <div ref={containerRef} className="subscribe-payment-container" />
            <p className="subscribe-payment-hint">
              После успешной оплаты вы будете перенаправлены на страницу подтверждения.
            </p>
          </div>
        )}

        {paymentPhase === 'error' && (
          <>
            <p className="subscribe-payment-error">{paymentError}</p>
            <button type="button" className="subscribe-pay-btn" onClick={() => { setPaymentPhase('form'); setPaymentError(null); }}>
              Вернуться к форме
            </button>
          </>
        )}
      </div>
    </div>
  );
}
