import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appBackgroundFluid]'
})
// adds svg element to parent element creating the fluid background.
export class BackgroundFluidDirective implements OnInit {

  private readonly backgroundColor = '#89ecda';
  private readonly colorOutTop = '#10898d';
  private readonly colorInTop = '#89ecda';
  private readonly colorOutBottom = '#046169';
  private readonly colorInBottom = '#89ecda';

  private readonly top = '7%';
  private readonly width = '100%';
  private readonly height = '93%';
  private readonly zIndex = '-1';


  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    const svg = this.renderer.createElement('svg', 'svg');
    this.renderer.setAttribute(svg, 'preserveAspectRatio', 'xMidYMid slice');
    this.renderer.setAttribute(svg, 'viewBox', '10 10 80 80');
    this.renderer.setStyle(svg, 'position', 'fixed');
    this.renderer.setStyle(svg, 'left', '0');
    this.renderer.setStyle(svg, 'top', this.top);
    this.renderer.setStyle(svg, 'background-color', this.backgroundColor);
    this.renderer.setStyle(svg, 'width', this.width);
    this.renderer.setStyle(svg, 'height', this.height);
    this.renderer.setStyle(svg, 'z-index', this.zIndex);

    const style = this.renderer.createElement('style');
    style.textContent = `
      @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .out-top { animation: rotate 20s linear infinite; transform-origin: 13px 25px; }
      .in-top { animation: rotate 10s linear infinite; transform-origin: 13px 25px; }
      .out-bottom { animation: rotate 25s linear infinite; transform-origin: 84px 93px; }
      .in-bottom { animation: rotate 15s linear infinite; transform-origin: 84px 93px; }
    `;
    this.renderer.appendChild(svg, style);

    const paths = [
      { fill: this.colorOutTop, class: 'out-top', d: 'M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z' },
      { fill: this.colorInTop, class: 'in-top', d: 'M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z' },
      { fill: this.colorOutBottom, class: 'out-bottom', d: 'M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z' },
      { fill: this.colorInBottom, class: 'in-bottom', d: 'M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z' }
    ];

    paths.forEach(pathData => {
      const path = this.renderer.createElement('path', 'svg');
      this.renderer.setAttribute(path, 'fill', pathData.fill);
      this.renderer.setAttribute(path, 'class', pathData.class);
      this.renderer.setAttribute(path, 'd', pathData.d);
      this.renderer.appendChild(svg, path);
    });

    this.renderer.appendChild(this.el.nativeElement, svg);
  }
}
