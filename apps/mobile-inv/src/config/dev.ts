export default {
  server: {
    protocol: 'http://',
    name: '192.168.100.10',
    port: 3649,
  },
  timeout: 5000,
  apiPath: 'api',
  debug: {
    showWarnings: true,
    useMockup: false,
  },
  system: [{
    name: "SellDocuments",
    component: "SellDocumentsNavigator",
    options: {
      title: 'Отвес-накладные',
      tabBarLabel: 'Отвесы',
      tabBarIcon: 'file-document-box',
      tabBarColor: '#CEE7E3',
    }
  }]
};
