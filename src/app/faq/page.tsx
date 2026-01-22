import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
    {
        question: "Как правильно выбрать мощность кондиционера?",
        answer: "Главный параметр – площадь помещения. В среднем, на каждые 10 м² требуется 1 кВт мощности охлаждения. Для солнечной стороны или помещений с большим количеством людей и техники, лучше взять с запасом."
    },
    {
        question: "Что такое инверторный кондиционер и чем он лучше обычного?",
        answer: "Инверторный кондиционер плавно регулирует мощность компрессора, а не просто включает и выключает его. Это делает его до 30-40% экономичнее, тише в работе и позволяет точнее поддерживать заданную температуру."
    },
    {
        question: "Что входит в 'эстетичный монтаж'?",
        answer: "Это установка, при которой мы уделяем максимум внимания внешнему виду. Коммуникации прячутся в стену (штробление) или маскируются аккуратными коробами. Мы стараемся сделать так, чтобы кондиционер и трассы были практически незаметны."
    },
    {
        question: "Как часто нужно обслуживать кондиционер?",
        answer: "Мы рекомендуем проводить полное техническое обслуживание один раз в год, обычно весной, перед началом сезона активного использования. Чистку фильтров внутреннего блока желательно делать самостоятельно раз в 1-2 месяца."
    },
    {
        question: "Даете ли вы гарантию на работы и оборудование?",
        answer: "Да, безусловно. Мы предоставляем официальную гарантию от производителя на все кондиционеры, а также собственную гарантию на выполненные монтажные работы."
    }
]

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-headline">Частые вопросы</h1>
        <p className="mt-3 max-w-2xl mx-auto text-base text-muted-foreground">
          Здесь мы собрали ответы на самые популярные вопросы наших клиентов.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
                 <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left font-semibold text-lg">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pt-2">
                        {item.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
}
