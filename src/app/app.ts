import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface Service {
  icon: 'athlete' | 'bodybuilding' | 'group' | 'online';
  title: string;
  description: string;
}

interface QuickCard {
  title: string;
  description: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  readonly year = new Date().getFullYear();

  readonly whatsappUrl =
    'https://wa.me/5511964979304?text=Ol%C3%A1%20Coach%20Kell%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20treinos.';

  readonly highlights = [
    '19 anos de experiência no mercado fitness',
    'Especialista em emagrecimento e hipertrofia',
    'Treinos adaptados à rotina e aos objetivos do aluno',
    'Atendimento humanizado e acompanhamento próximo',
  ];

  readonly services: Service[] = [
    {
      icon: 'athlete',
      title: 'Suporte para atletas',
      description:
        'Treinamento complementar para atletas de modalidades como jiu-jítsu, rugby e outros esportes, com foco em força, resistência e prevenção de lesões.',
    },
    {
      icon: 'bodybuilding',
      title: 'Iniciantes no fisiculturismo',
      description:
        'Acompanhamento ideal para quem deseja iniciar no fisiculturismo com segurança, técnica correta e evolução progressiva.',
    },
    {
      icon: 'group',
      title: 'Treinos personalizados',
      description:
        'Atendimento individual ou em grupos reduzidos, com planejamento estratégico e acompanhamento contínuo.',
    },
    {
      icon: 'online',
      title: 'Consultoria online',
      description:
        'Consultoria on-line com suporte de qualidade, ajustes periódicos e acompanhamento para manter a evolução mesmo à distância.',
    },
  ];

  readonly quickCards: QuickCard[] = [
    {
      title: 'Emagrecimento',
      description: 'Perda de gordura e melhora do condicionamento físico.',
    },
    {
      title: 'Hipertrofia',
      description: 'Ganho de massa muscular com treinos estruturados.',
    },
    {
      title: 'Consultoria Online',
      description: 'Acompanhamento profissional onde você estiver.',
    },
  ];
}
