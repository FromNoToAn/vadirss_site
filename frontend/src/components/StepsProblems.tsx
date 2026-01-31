const STEPS = [
  { n: 1, title: 'Состав определяется "На глазок"', desc: 'Новички обижаются, ветераны недовольны. Нет данных — есть только мнения.' },
  { n: 2, title: 'Игроки теряют интерес', desc: 'Платят взносы, но играют по 5 минут. Мотивация падает, команда рушится.' },
  { n: 3, title: 'Нет общей цели', desc: 'Каждый тянет в свою сторону. Новички хотят играть, ветераны — побеждать.' },
];

export function StepsProblems() {
  return (
    <section data-type="steps" id="steps-2" className="s-steps-type-1 sb-text-white sb-align-center sb-padding-top_l sb-padding-bottom_l">
      <div className="sb-background" style={{ background: '#111111' }} />
      <div className="sb-container sb-m-clear-bottom">
        <div className="sb-row sb-m-3-bottom">
          <h2 className="sb-col_lg-8 sb-col-offset_lg-2 sb-col_md-12 sb-col_sm-12 sb-col_xs-12 sb-font-title sb-font-h2">Знакомые ситуации?</h2>
        </div>
        <div className="sb-row sb-m-5-top-minus sb-row_center">
          {STEPS.map(({ n, title, desc }) => (
            <div key={n} className="sb-col_lg-4 sb-col_md-4 sb-col_sm-4 sb-col_xs-12 s-steps-type-1__block-wrapper sb-m-5-top">
              <div className="s-steps-type-1__block sb-m-clear-bottom">
                <div className="s-steps-type-1__line s-steps-type-1__line_left sb-color-border" />
                <div className="s-steps-type-1__line s-steps-type-1__line_right sb-color-border" />
                <div className="s-steps-type-1__counter sb-font-title sb-font-h4 sb-m-10-bottom">
                  <div className="s-steps-type-1__circle sb-color-border">{n}</div>
                </div>
                <div className="sb-m-clear-bottom">
                  <h3 className="sb-font-title sb-font-h4 sb-m-18-bottom">{title}</h3>
                  <div className="sb-font-p2 sb-text-opacity">{desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
