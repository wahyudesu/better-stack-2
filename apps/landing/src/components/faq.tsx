import { PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "Platform apa aja yang didukung ZenPost?",
    answer:
      "ZenPost mendukung Instagram, Facebook, TikTok, YouTube, LinkedIn, dan Twitter/X. Semua dalam satu dashboard — nggak perlu switch tab lagi.",
  },
  {
    question: "Apakah data akun social media aman di ZenPost?",
    answer:
      "Aman. Kami menggunakan enkripsi standar industri dan nggak pernah menyimpan credential asli akun social media kamu. Koneksi menggunakan OAuth yang aman.",
  },
  {
    question: "Apakah bisa pakai ZenPost bareng tim?",
    answer:
      "Bisa! Fitur multi-user dengan role access memungkinkan kamu invite team members dengan 권한 yang berbeda — admin, editor, atau viewer.",
  },
  {
    question: "Bagaimana sistem pricing ZenPost?",
    answer:
      "Kami lagi dalam fase early access dengan harga khusus. Daftar waitlist sekarang untuk dapat akses awal dan info pricing terbaru langsung ke email kamu.",
  },
];

export const FAQ = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex text-center justify-center items-center gap-4 flex-col">
          <Badge variant="outline">FAQ</Badge>
          <div className="flex gap-2 flex-col">
            <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-center font-regular">
              Ada pertanyaan?
            </h4>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
              Temukan jawaban pertanyaan umum tentang ZenPost di bawah ini.
              Still punya pertanyaan lain? Reach out aja.
            </p>
          </div>
        </div>

        <div className="max-w-3xl w-full mx-auto">
          <Accordion defaultValue={["faq-0"]} className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={"faq-" + index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="flex justify-center">
          <Button className="gap-4" variant="outline">
            Any questions? Reach out <PhoneCall className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
);