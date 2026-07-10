import {
  Component,
  OnDestroy,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
  viewChild,
  ElementRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';

interface Service {
  icon: 'athlete' | 'bodybuilding' | 'group' | 'online' | 'rehab';
  title: string;
  description: string;
}

interface QuickCard {
  title: string;
  description: string;
}

interface Result {
  src: string;
  alt: string;
  type: 'image' | 'video';
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private autoplayTimer?: ReturnType<typeof setInterval>;
  private scrollObserver?: IntersectionObserver;

  readonly resultsTrack = viewChild<ElementRef<HTMLElement>>('resultsTrack');

  readonly year = new Date().getFullYear();
  readonly activeSlide = signal(0);
  readonly carouselPaused = signal(false);

  readonly whatsappUrl =
    'https://wa.me/5511964979304?text=Ol%C3%A1%20Coach%20Kell%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20treinos.';

  readonly highlights = [
    '19 anos de experiência no mercado fitness',
    'Especialista em emagrecimento e hipertrofia',
    'Especializado no tratamento de pessoas com lesões graves e idosos',
    'Treinos adaptados à rotina e aos objetivos do aluno',
    'Atendimento humanizado e acompanhamento próximo',
  ];

  readonly services: Service[] = [
    {
      icon: 'rehab',
      title: 'Lesões graves e idosos',
      description:
        'Especializado no tratamento e reabilitação de pessoas com lesões graves e no acompanhamento de idosos, com treinos seguros, progressivos e adaptados às limitações de cada aluno.',
    },
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

  readonly results: Result[] = [
    { src: '/resultado1.jpeg', alt: 'Transformação física — resultado 1', type: 'image' },
    { src: '/resultado2.jpeg', alt: 'Transformação física — resultado 2', type: 'image' },
    { src: '/resultado3.jpeg', alt: 'Transformação física — resultado 3', type: 'image' },
    { src: '/resultado4.jpeg', alt: 'Transformação física — resultado 4', type: 'image' },
    { src: '/resultado5.jpeg', alt: 'Transformação física — resultado 5', type: 'image' },
    { src: '/resultado6.jpeg', alt: 'Transformação física — resultado 6', type: 'image' },
    { src: '/resultado7.jpeg', alt: 'Transformação física — resultado 7', type: 'image' },
    { src: '/resultado8.mp4', alt: 'Transformação física — resultado 8', type: 'video' },
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
      title: 'Lesões e idosos',
      description: 'Tratamento especializado para lesões graves e acompanhamento de idosos.',
    },
    {
      title: 'Consultoria Online',
      description: 'Acompanhamento profissional onde você estiver.',
    },
  ];

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        requestAnimationFrame(() => {
          this.setupCarouselObserver();
          this.syncVideos(this.activeSlide());
          this.startAutoplay();
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
    this.scrollObserver?.disconnect();
  }

  slideLabel(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  pauseCarousel(): void {
    this.carouselPaused.set(true);
    this.stopAutoplay();
  }

  resumeCarousel(): void {
    this.carouselPaused.set(false);
    this.startAutoplay();
  }

  scrollPrev(): void {
    const track = this.resultsTrack()?.nativeElement;
    if (!track) return;

    const slide = track.querySelector<HTMLElement>('[data-slide]');
    if (!slide) return;

    const step = slide.offsetWidth + this.getGap(track);
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft <= step * 0.5) {
      track.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: -step, behavior: 'smooth' });
    }
  }

  scrollNext(): void {
    const track = this.resultsTrack()?.nativeElement;
    if (!track) return;

    const slide = track.querySelector<HTMLElement>('[data-slide]');
    if (!slide) return;

    const step = slide.offsetWidth + this.getGap(track);
    const maxScroll = track.scrollWidth - track.clientWidth;

    if (track.scrollLeft >= maxScroll - step * 0.5) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: step, behavior: 'smooth' });
    }
  }

  goToSlide(index: number): void {
    const track = this.resultsTrack()?.nativeElement;
    const slide = track?.querySelectorAll<HTMLElement>('[data-slide]')[index];
    slide?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    this.activeSlide.set(index);
    this.syncVideos(index);
  }

  private syncVideos(activeIndex: number): void {
    const track = this.resultsTrack()?.nativeElement;
    if (!track) return;

    track.querySelectorAll<HTMLVideoElement>('video').forEach((video) => {
      const slide = video.closest<HTMLElement>('[data-slide]');
      const index = Number(slide?.dataset['index']);
      if (index === activeIndex) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  private getGap(track: HTMLElement): number {
    const style = getComputedStyle(track);
    return parseFloat(style.columnGap || style.gap) || 20;
  }

  private setupCarouselObserver(): void {
    const track = this.resultsTrack()?.nativeElement;
    if (!track) return;

    const slides = track.querySelectorAll<HTMLElement>('[data-slide]');
    if (!slides.length) return;

    this.scrollObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            const index = Number((entry.target as HTMLElement).dataset['index']);
            if (!Number.isNaN(index)) {
              this.activeSlide.set(index);
              this.syncVideos(index);
            }
          }
        }
      },
      { root: track, threshold: [0.55, 0.75] },
    );

    slides.forEach((slide) => this.scrollObserver?.observe(slide));
  }

  private startAutoplay(): void {
    if (!isPlatformBrowser(this.platformId) || this.carouselPaused()) return;
    this.stopAutoplay();
    this.autoplayTimer = setInterval(() => this.scrollNext(), 5000);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }
}
