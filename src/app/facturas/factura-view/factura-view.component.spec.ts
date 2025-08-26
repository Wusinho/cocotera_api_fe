
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { FacturaViewComponent } from './factura-view.component';
import { FacturaService, Factura } from '../../services/factura.service';

describe('FacturaViewComponent (with template)', () => {
  let fixture: ComponentFixture<FacturaViewComponent>;
  let component: FacturaViewComponent;

  // ---- Mocks ----
  const mockActivatedRoute = {
    snapshot: { paramMap: { get: (_: string) => '42' } }
  } as Partial<ActivatedRoute>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  } as Partial<Router>;

  // Build realistic data to satisfy template bindings
  const sampleFacturas: Factura[] = [
    {
      id: 101,
      cliente: {
        nombres: 'Ada',
        apellidos: 'Lovelace',
        dni: '12345678',
        direccion: 'Calle 1 #234'
      },
      productos: [
        {
          producto: { nombre: 'Jean VIP', categoria: 'Pantalon', color: 'Marrón', precio: 10 },
          cantidad: 3,
          total: 30
        },
        {
          producto: { nombre: 'Blusa VIP', categoria: 'Blusa', color: 'Blanco', precio: 15 },
          cantidad: 2,
          total: 50
        }
      ]
    } as any,
    {
      id: 102,
      cliente: {
        nombres: 'Ada',
        apellidos: 'Lovelace',
        dni: '12345678',
        direccion: 'Calle 1 #234'
      },
      productos: [
        {
          producto: { nombre: 'Blusa VIP', categoria: 'Blusa', color: 'Blanco', precio: 15 },
          cantidad: 2,
          total: 30 
        }
      ]
    } as any
  ];

  const mockFacturaService = {
    getFacturasByCliente: jasmine.createSpy('getFacturasByCliente').and.returnValue(of(sampleFacturas))
  } as Partial<FacturaService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturaViewComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: FacturaService, useValue: mockFacturaService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FacturaViewComponent);
    component = fixture.componentInstance;
  });

  function text(el: Element): string {
    return (el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  it('deberia crear', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit lee el clientId y renderiza las facturas', () => {
    fixture.detectChanges(); 

    expect(component.clientId).toBe(42);
    expect(mockFacturaService.getFacturasByCliente).toHaveBeenCalledWith(42);
    expect(component.facturas).toEqual(sampleFacturas);

    const h2 = fixture.debugElement.query(By.css('h2')).nativeElement as HTMLElement;
    expect(text(h2)).toContain('Facturas de Ada Lovelace');

    const pTags = fixture.debugElement.queryAll(By.css('p'));
    expect(text(pTags[0].nativeElement)).toContain('DNI: 12345678');
    expect(text(pTags[1].nativeElement)).toContain('Dirección: Calle 1 #234');
  });

  it('should render product rows for the first factura', () => {
    fixture.detectChanges();

    const tables = fixture.debugElement.queryAll(By.css('table'));
    expect(tables.length).toBeGreaterThan(0);

    const firstTbodyRows = tables[0].queryAll(By.css('tbody tr'));
    expect(firstTbodyRows.length).toBe(sampleFacturas[0].productos.length);

    // Check some cell values in the first row
    const firstRowCells = firstTbodyRows[0].queryAll(By.css('td')).map(c => text(c.nativeElement));
    expect(firstRowCells[0]).toBe('Jean VIP');
    expect(firstRowCells[1]).toBe('Pantalon');
    expect(firstRowCells[2]).toBe('Marrón');
    expect(firstRowCells[3]).toBe('S/ 10');
    expect(firstRowCells[4]).toBe('3');
    expect(firstRowCells[5]).toBe('S/ 30');
  });


it('should render subtotal/IGV/total for the first factura footer', () => {
  fixture.detectChanges();

  const f = sampleFacturas[0];
  const expectedSubtotal = f.productos.reduce((s, it) => s + it.total, 0); 
  const expectedIGV = expectedSubtotal * 0.18;
  const expectedTotal = expectedSubtotal + expectedIGV;

  const firstTable = fixture.debugElement.queryAll(By.css('table'))[0];
  const tfootRows = firstTable.queryAll(By.css('tfoot tr'));
  expect(tfootRows.length).toBe(3);

  // Helper: get last <td> text of a row
  const lastCellText = (rowIndex: number) => {
    const tds = tfootRows[rowIndex].queryAll(By.css('td'));
    expect(tds.length).toBeGreaterThan(0);
    const last = tds[tds.length - 1].nativeElement as HTMLElement;
    return (last.textContent || '').trim();
  };

  const toNumber = (s: string) => Number(s.replace(/[^\d.\-]/g, ''));

  const subtotalText = lastCellText(0);
  const igvText = lastCellText(1);
  const totalText = lastCellText(2);

  expect(subtotalText).toContain('S/');
  expect(igvText).toContain('S/');
  expect(totalText).toContain('S/');

  expect(toNumber(subtotalText)).toBeCloseTo(expectedSubtotal, 6);
  expect(toNumber(igvText)).toBeCloseTo(expectedIGV, 6);
  expect(toNumber(totalText)).toBeCloseTo(expectedTotal, 6);
});


  it('getSubTotal / getIGV / getTotalConIGV deberia ser igual', () => {
    const f = sampleFacturas[0];
    expect(component.getSubTotal(f)).toBe(80);
    expect(component.getIGV(f)).toBeCloseTo(14.4, 6);
    expect(component.getTotalConIGV(f)).toBeCloseTo(94.4, 6);
  });

  it('goBack deberia navegar a /clients', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/clients']);
  });
});
