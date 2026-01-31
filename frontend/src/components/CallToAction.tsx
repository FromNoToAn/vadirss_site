import React from 'react';
import { img } from '../assets';

type Props = {
  id: string;
  title: string | React.ReactNode;
  buttonText: string;
  buttonHref?: string;
  bgImage?: string;
  bgColor?: string;
  overlay?: number;
};

export function CallToAction({ id, title, buttonText, buttonHref, bgImage, bgColor, overlay = 0.3 }: Props) {
  const style: React.CSSProperties = bgImage
    ? { backgroundImage: `url(${img(bgImage)})` }
    : { background: bgColor || '#111111' };

  return (
    <section data-type="call-to-action" id={id} className="s-call-to-action-type-1 sb-text-white sb-align-center sb-padding-top_l sb-padding-bottom_l">
      {bgImage ? (
        <div className="sb-background-image sb-background" style={style}>
          <div className="sb-background-overlay" style={{ opacity: overlay }} />
        </div>
      ) : (
        <div className="sb-background" style={style} />
      )}
      <div className="sb-container sb-m-clear-bottom">
        <div className="sb-row s-call-to-action-type-1__header sb-m-5-bottom">
          <div className="sb-col_lg-8 sb-col-offset_lg-2 sb-col_md-12 sb-col_sm-12 sb-col_xs-12">
            <h2 className="sb-font-h3 sb-font-title">{title}</h2>
          </div>
        </div>
        <div className="s-call-to-action-type-1__buttons sb-m-clear-bottom">
          <a
            href={buttonHref ?? '#advantages-blocks-2'}
            className="sb-button-primary sb-button-primary_white s-call-to-action-type-1__button sb-m-20-bottom sb-button-scheme-dark"
            style={{ backgroundColor: '#FFFFFF' }}
            {...(buttonHref?.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            {buttonText}
          </a>
        </div>
      </div>
    </section>
  );
}
