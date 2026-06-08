/**
 * <environment>
 *   <purpose>Configuracion para produccion real.</purpose>
 *   <videoGate>En produccion se puede recordar que el usuario ya termino el video.</videoGate>
 * </environment>
 */
export const environment = {
  production: true,
  apiBaseUrl: '/api',
  useApiVisitCounter: true,
  persistVideoGateCompletion: true,
  resetVideoGateOnAppLoad: false
};
