import { Users, Calendar, FileText, TrendingUp, Eye, CalendarPlus } from 'lucide-react';

const AdminDashboard = () => {
  // Dados de exemplo - depois conectar com backend
  const stats = [
    { name: 'Eventos este Mês', value: '23', change: '+3', icon: Calendar, color: 'green' },
    { name: 'Inscrições Pendentes', value: '45', change: '-2', icon: FileText, color: 'yellow' },
    { name: 'Check-ins Hoje', value: '189', change: '+25%', icon: TrendingUp, color: 'purple' },
    { name: 'Visualizações do Site', value: '2,847', change: '+18%', icon: Eye, color: 'blue' }
  ];

  const recentActivities = [
    { id: 1, action: 'Evento criado', user: 'Pastor Ricardo', time: '15 min atrás' },
    { id: 2, action: 'Check-in realizado', user: 'Maria Santos', time: '1 hora atrás' },
    { id: 3, action: 'Inscrição confirmada', user: 'Pedro Costa', time: '2 horas atrás' },
    { id: 4, action: 'Galeria atualizada', user: 'Admin', time: '3 horas atrás' }
  ];

  const quickActions = [
    { name: 'Novo Evento', icon: CalendarPlus, href: '/admin/eventos/novo', color: 'green' },
    { name: 'Ver Relatórios', icon: Eye, href: '/admin/relatorios', color: 'purple' },
    { name: 'Gerenciar Mídia', icon: Users, href: '/admin/galeria', color: 'blue' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral das atividades da igreja</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0`}>
                  <div className={`w-8 h-8 bg-${stat.color}-100 rounded-md flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <a
                    key={action.name}
                    href={action.href}
                    className={`flex items-center p-3 rounded-lg border-2 border-${action.color}-100 hover:border-${action.color}-200 hover:bg-${action.color}-50 transition-colors`}
                  >
                    <Icon className={`h-5 w-5 text-${action.color}-600 mr-3`} />
                    <span className="font-medium text-gray-900">{action.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Atividades Recentes</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, index) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {index !== recentActivities.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <Users className="h-4 w-4 text-white" />
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">{activity.user}</span>
                              {' '}
                              <span className="text-gray-500">{activity.action}</span>
                            </div>
                            <p className="mt-0.5 text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Inscrições em Eventos</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Gráfico será implementado aqui</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Frequência de Eventos</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Gráfico será implementado aqui</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;