const SHEET_NAME = 'Registros';

function doPost(e) {
  try {
    const sheet = getSheet_();
    const payload = JSON.parse((e && e.postData && e.postData.contents) ? e.postData.contents : '{}');

    if (!payload.ubicacion || !payload.latitud || !payload.longitud) {
      return jsonOutput_({
        ok: false,
        message: 'Faltan datos obligatorios: ubicación, latitud o longitud.'
      });
    }

    ensureHeaders_(sheet);

    sheet.appendRow([
      new Date(),
      payload.fechaHora || '',
      payload.ubicacion || '',
      payload.referencia || '',
      payload.latitud || '',
      payload.longitud || '',
      payload.precision || '',
      payload.googleMaps || '',
      payload.capturadoDesde || ''
    ]);

    return jsonOutput_({
      ok: true,
      message: 'Registro guardado correctamente en Google Sheets.'
    });
  } catch (error) {
    return jsonOutput_({
      ok: false,
      message: error && error.message ? error.message : 'Error interno al guardar el registro.'
    });
  }
}

function doGet() {
  return jsonOutput_({
    ok: true,
    message: 'Servicio activo.'
  });
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  return sheet;
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() > 0) return;

  sheet.appendRow([
    'Timestamp Apps Script',
    'Fecha y hora dispositivo',
    'Domicilio detectado',
    'Referencia adicional',
    'Latitud',
    'Longitud',
    'Precisión estimada (m)',
    'Google Maps',
    'Capturado desde'
  ]);

  sheet.setFrozenRows(1);
}

function jsonOutput_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
