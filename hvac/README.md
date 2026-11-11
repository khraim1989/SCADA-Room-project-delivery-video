# SCADA Room: HVAC Design Package (FOR REVIEW)

This package is the cooling-load check, A/C unit selection and HVAC layout for the 40 ft high-cube SCADA Room E-House. The geometry and the A/C positions come from GA drawing SWS-2286 Rev 0.

| File | What it is |
|---|---|
| `SWS-SCADA-Room-HVAC-Heat-Load-and-Selection.xlsx` | Live calculation workbook (formulas). Sheets: **Design Basis** (inputs), **Heat Load**, **Unit Selection** (N+1 check), **Equipment Schedule**, **Notes & Assumptions** |
| `SWS-SCADA-Room-HVAC-Layout-A3.pdf` / `.png` / `.svg` | Drawing **SWS-2286-HVAC-01 Rev A**: plan, front elevation, section A-A, equipment schedule, design basis and load summary, notes |
| `build_hvac_calc.py`, `build_hvac_drawing.py` | Regenerate the workbook and the drawing |

## Result (current assumptions)
- **Design cooling load:** 12.15 kW (3.45 TR), including a 10% margin. Sensible 10.94 kW, latent 1.21 kW.
- **Selection:** 3 × 2.5 TR T3 split units with N+1 redundancy. Two running units give 14.1 kW at 50 °C ambient, a 16% margin.
- **Controls:** a lead/lag controller rotates the duty unit every 24 h and starts the standby unit at 28 °C or on a fault. The F&G system trips all units on fire, and an alarm goes to SCADA.

## Confirm before procurement (yellow cells on Design Basis)
1. **Equipment heat dissipation:** currently a **6.0 kW placeholder**. It is 54% of the load, so replace it with the panel, UPS and DB vendor heat lists.
2. **Outdoor design condition:** 50 °C dry bulb and 22 g/kg (conservative). Use the project HVAC specification if it differs.
3. **Wall and roof U-value:** 0.45 W/m²K, assuming 50 mm PU panels. Floor 0.60 W/m²K.
4. **Unit derating at design ambient:** 80% of nominal. Confirm with the manufacturer's T3 capacity table for the actual installed units.

## Regenerate after changing inputs
Edit the blue cells on **Design Basis** in Excel; the workbook recalculates itself. To rebuild the drawing with the new figures:
```bash
python3 hvac/build_hvac_calc.py        # only if you want to reset the workbook to defaults
# recalculate the xlsx (Excel: open + save; or LibreOffice headless), then:
python3 hvac/build_hvac_drawing.py     # reads results from the workbook → PDF/PNG/SVG
```

Status: **FOR REVIEW, not for construction.** This is a design check, not a stamped calculation. Client details are withheld, as on the GA drawing.
