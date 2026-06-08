/**
 * <environment>
 *   <purpose>Configuracion local mientras la landing aun no esta en produccion.</purpose>
 *   <videoGate>En desarrollo no se persiste el desbloqueo; cada recarga vuelve a bloquear el funnel.</videoGate>
 * </environment>
 */
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api',
  useApiVisitCounter: false,
  persistVideoGateCompletion: false,
  resetVideoGateOnAppLoad: true
};
