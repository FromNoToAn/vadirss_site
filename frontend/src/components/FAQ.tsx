import { useState } from 'react';

const ITEMS = [
  { q: 'А если у нас нет постоянного тренера? Капитан ведёт команду.', a: 'Идеально подходит. Капитан получает те же инструменты, что и тренер: может ставить оценки, видеть аналитику, формировать челленджи. Система становится его цифровым помощником в управлении командой.' },
  { q: 'Можно ли экспортировать данные, чтобы показать спонсору или руководству клуба?', a: 'Да, во всех тарифах доступны ежемесячные отчёты в PDF.' },
  { q: 'Что такое «ИИ-челленджи» и как они помогают новичкам?', a: 'Это персонализированные задания, которые бот формирует на основе слабых сторон игрока. Например, для новичка с низкой стрессоустойчивостью: «В следующем тайме после ошибки сразу сделай точный пас». Это переводит фокус с обиды на конкретную задачу и развитие.' },
  { q: 'А если тренер захочет «подкрутить» рейтинг своим?', a: 'Система учитывает не только оценки тренера, но и активность игроков, выполнение челленджей и динамику. Накрутить не выйдет.' },
  { q: 'Не будут ли игроки против того, что за ними «следят»?', a: 'Это не слежка, а персональный цифровой тренер. Каждый игрок видит только свои данные и свои задания для роста. Полный доступ к данным есть только у представителя команды или тренера.' },
  { q: 'Сколько времени занимает подключение команды?', a: '5-7 минут. Тренер/капитан регистрирует команду в боте, отправляет игрокам приглашения. Игроки принимают их — и система готова к работе. Ничего скачивать не нужно.' },
  { q: 'А если игрок не хочет участвовать?', a: 'Участие добровольное. Но практика показывает, что когда большинство команды начинает видеть свой рост и прогресс, остальные подключаются сами.' },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section data-type="faq" id="faq-2" className="s-faq-type-3 sb-text-dark sb-padding-top_l sb-padding-bottom_l">
      <div className="sb-background" style={{ background: '#FFFFFF' }} />
      <div className="sb-container sb-m-clear-bottom sb-p-clear-bottom">
        <div className="sb-row sb-m-3-bottom">
          <div className="sb-col_lg-10 sb-col_md-12 sb-col_sm-12 sb-col_xs-12">
            <h2 className="sb-font-h2 sb-font-title">Вопрос-ответ</h2>
          </div>
        </div>
        {ITEMS.map(({ q, a }, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`s-faq-type-3__question sb-m-6-bottom sb-p-6-bottom sb-color-border ${isOpen ? 's-faq-type-3__question_open' : ''}`}
            >
              <button
                type="button"
                className="s-faq-type-3__collapse-btn"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Свернуть' : 'Развернуть'}
              />
              <h5
                className="s-faq-type-3__ask sb-align-left sb-font-h5 sb-font-title"
                onClick={() => toggle(i)}
                onKeyDown={(e) => e.key === 'Enter' && toggle(i)}
                role="button"
                tabIndex={0}
              >
                {q}
              </h5>
              <div className={`s-faq-type-3__answer ${isOpen ? 'faq-answer_open' : ''}`}>
                <div className="s-faq-type-3__answer-inner">
                  <div className="s-faq-type-3__answer-text sb-p-18-top sb-text-opacity sb-align-left sb-font-p3">{a}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
