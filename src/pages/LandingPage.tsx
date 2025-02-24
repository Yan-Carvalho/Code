import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Barcode, 
  QrCode, 
  Clock, 
  Settings, 
  Users, 
  ChevronRight,
  CheckCircle2,
  MessageCircle,
  Mail,
  Phone,
  Zap,
  Shield,
  Database,
  BarChart3,
  Heart,
  Coffee
} from 'lucide-react';

function BenefitCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition transform hover:scale-105">
      <div className="inline-block p-3 bg-blue-50 rounded-lg">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-4 text-gray-600">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1">
      <div className="inline-block p-3 bg-blue-50 rounded-lg">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-4 text-gray-600">{description}</p>
    </div>
  );
}

function PricingCard({ title, price, features, highlighted = false, isEnterprise = false, mostPopular = false }) {
  return (
    <div className={`
      relative bg-white rounded-xl p-8 h-full flex flex-col
      ${highlighted ? 'ring-2 ring-blue-600 shadow-xl scale-105' : 'shadow-sm'}
      ${isEnterprise ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white' : ''}
      hover:transform hover:scale-[1.02] transition-all duration-300
    `}>
      {mostPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-1 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap">
            Mais Vendido
          </div>
        </div>
      )}
      <div className={`
        absolute -right-2 -top-2 w-24 h-24 ${isEnterprise ? 'bg-white/10' : 'bg-blue-50'} 
        rounded-full blur-2xl opacity-80
      `}></div>
      <h3 className={`text-xl font-semibold relative ${isEnterprise ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <div className="mt-4 flex items-baseline relative">
        {price === "Personalizado" ? (
          <span className="text-3xl font-bold">Personalizado</span>
        ) : (
          <>
            <span className="text-sm mr-1">R$</span>
            <span className="text-4xl font-bold">{price}</span>
            <span className={`ml-2 ${isEnterprise ? 'text-blue-100' : 'text-gray-600'}`}>/mês</span>
          </>
        )}
      </div>
      <ul className="mt-8 space-y-4 flex-grow relative">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle2 className={`h-5 w-5 ${isEnterprise ? 'text-blue-200' : 'text-green-500'} mr-3 flex-shrink-0`} />
            <span className={`${isEnterprise ? 'text-blue-50' : 'text-gray-600'} break-words`}>{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`
        relative mt-8 w-full py-3 px-6 rounded-lg font-medium 
        transition transform hover:scale-105 hover:shadow-lg
        ${isEnterprise 
          ? 'bg-white text-blue-600 hover:bg-blue-50' 
          : highlighted 
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800' 
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}
      `}>
        {isEnterprise ? 'Falar com Consultor' : 'Começar Agora'}
      </button>
    </div>
  );
}

function ContactCard({ icon, title, value, description }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1">
      <div className="flex justify-center">
        <div className="p-3 bg-blue-50 rounded-lg">
          {icon}
        </div>
      </div>
      <h3 className="mt-4 font-semibold text-gray-900 text-center">{title}</h3>
      <p className="mt-2 text-blue-600 font-semibold text-center break-words">{value}</p>
      <p className="mt-1 text-sm text-gray-500 text-center">{description}</p>
    </div>
  );
}

function TestimonialCard({ content, author, role }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
      <p className="text-gray-600 italic">"{content}"</p>
      <div className="mt-6">
        <p className="font-semibold text-gray-900">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm mb-6">
                <Zap className="h-4 w-4 mr-2" />
                Economize até 90% do seu tempo
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Gere Milhares de Códigos em Questão de Minutos
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed">
                Chega de perder horas preciosas gerando códigos manualmente. Com o CodeMaster, você automatiza todo o processo e tem mais tempo para o que realmente importa: sua família e seu negócio.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleLogin}
                  className="inline-flex items-center justify-center bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition transform hover:scale-105"
                >
                  Começar Agora
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
                <button 
                  onClick={() => {
                    const element = document.getElementById('beneficios');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition"
                >
                  Ver Demonstração
                </button>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">+1000</div>
                  <div className="text-gray-600 text-sm">Clientes Ativos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">10M+</div>
                  <div className="text-gray-600 text-sm">Códigos Gerados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">99.9%</div>
                  <div className="text-gray-600 text-sm">Disponibilidade</div>
                </div>
              </div>
            </div>
            <div className="relative max-w-full">
              <div className="absolute inset-0 bg-blue-600 rounded-2xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"
                alt="Dashboard do CodeMaster mostrando interface de geração de códigos"
                className="relative rounded-2xl shadow-2xl transform hover:scale-105 transition duration-500 max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Transforme Horas de Trabalho em Minutos de Produtividade
            </h2>
            <p className="text-xl text-gray-600">
              Nossos clientes economizam em média 20 horas por semana automatizando a geração de códigos. 
              Imagine o que você pode fazer com todo esse tempo extra!
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BenefitCard
              icon={<Clock className="h-8 w-8 text-blue-600" />}
              title="Mais Tempo Livre"
              description="Automatize tarefas repetitivas e tenha mais tempo para sua família e lazer"
            />
            <BenefitCard
              icon={<Heart className="h-8 w-8 text-blue-600" />}
              title="Menos Estresse"
              description="Elimine a preocupação com erros manuais e processos demorados"
            />
            <BenefitCard
              icon={<Shield className="h-8 w-8 text-blue-600" />}
              title="100% Seguro"
              description="Códigos únicos e verificados, sem risco de duplicação"
            />
            <BenefitCard
              icon={<Coffee className="h-8 w-8 text-blue-600" />}
              title="Simplicidade"
              description="Interface intuitiva que qualquer pessoa pode usar"
            />
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section id="recursos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Tudo que Você Precisa em Um Só Lugar
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-blue-600" />}
              title="Geração em Massa"
              description="Crie milhares de códigos únicos em segundos, com verificação automática de duplicidade"
            />
            <FeatureCard
              icon={<Settings className="h-8 w-8 text-blue-600" />}
              title="Personalização Total"
              description="Customize cores, tamanhos, formatos e adicione sua marca aos códigos gerados"
            />
            <FeatureCard
              icon={<Database className="h-8 w-8 text-blue-600" />}
              title="Exportação Flexível"
              description="Exporte seus códigos em PDF, Excel, CSV ou integre diretamente com seu sistema"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-blue-600" />}
              title="Multiusuário"
              description="Trabalhe em equipe com controle total de permissões e histórico de ações"
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-blue-600" />}
              title="Relatórios Detalhados"
              description="Acompanhe a geração e uso dos códigos com análises em tempo real"
            />
            <FeatureCard
              icon={<QrCode className="h-8 w-8 text-blue-600" />}
              title="Múltiplos Formatos"
              description="Suporte a todos os principais formatos de códigos de barras e QR Codes"
            />
          </div>
        </div>
      </section>

      {/* Preços */}
      <section id="precos" className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Escolha o Plano Ideal para Seu Negócio
            </h2>
            <p className="text-xl text-gray-600">
              Comece com nosso plano básico e escale conforme seu negócio cresce. 
              Sem contratos longos, cancele quando quiser.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <PricingCard
              title="Básico"
              price="99"
              features={[
                "Até 1.000 códigos/mês",
                "Menos de 0,10 R$ por unidade",
                "Personalização básica",
                "Suporte por email",
                "Exportação em PDF",
                "Relatórios básicos",
                "Backup semanal",
                "Acesso à API básica"
              ]}
            />
            <PricingCard
              title="Profissional"
              price="199"
              features={[
                "Até 10.000 códigos/mês",
                "Menos de 0,02 R$ por unidade",
                "Personalização avançada",
                "Suporte prioritário",
                "Todos os formatos de exportação",
                "API REST completa",
                "Relatórios avançados",
                "Backup diário",
                "Integrações via webhook",
                "Dashboard personalizado"
              ]}
              highlighted
              mostPopular
            />
            <PricingCard
              title="Enterprise"
              price="Personalizado"
              features={[
                "Códigos ilimitados",
                "Menos de 0,01 R$ por unidade",
                "Personalização total",
                "Suporte 24/7 dedicado",
                "Integração personalizada",
                "API exclusiva",
                "Relatórios customizados",
                "SLA garantido",
                "Treinamento da equipe",
                "Ambiente exclusivo",
                "Backup em tempo real",
                "Infraestrutura dedicada"
              ]}
              isEnterprise
            />
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            O Que Nossos Clientes Dizem
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              content="Economizamos mais de 30 horas por semana depois que começamos a usar o CodeMaster. A equipe está muito mais produtiva!"
              author="Maria Silva"
              role="Gerente de Operações"
            />
            <TestimonialCard
              content="A facilidade de uso e a rapidez na geração dos códigos são impressionantes. Melhor investimento que fizemos este ano."
              author="João Santos"
              role="Proprietário de Gráfica"
            />
            <TestimonialCard
              content="O suporte é excepcional e o sistema nunca nos deixou na mão. Recomendo para qualquer empresa que precise de automação."
              author="Ana Costa"
              role="Coordenadora de Eventos"
            />
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Fale Conosco</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ContactCard
              icon={<MessageCircle className="h-8 w-8" />}
              title="WhatsApp"
              value="+55 11 99999-9999"
              description="Resposta em até 5 minutos"
            />
            <ContactCard
              icon={<Mail className="h-8 w-8" />}
              title="Email"
              value="contato@codemaster.com.br"
              description="Resposta em até 24 horas"
            />
            <ContactCard
              icon={<Phone className="h-8 w-8" />}
              title="Telefone"
              value="0800 123 4567"
              description="Seg-Sex, 9h às 18h"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <Barcode className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">CodeMaster</span>
              </div>
              <p className="mt-4 text-gray-400">
                Automatizando a geração de códigos para empresas de todos os tamanhos.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => {
                  const element = document.getElementById('beneficios');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }} className="hover:text-white">Benefícios</button></li>
                <li><button onClick={() => {
                  const element = document.getElementById('recursos');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }} className="hover:text-white">Recursos</button></li>
                <li><button onClick={() => {
                  const element = document.getElementById('precos');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }} className="hover:text-white">Preços</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white">Política de Cookies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white">Documentação</a></li>
                <li><a href="#" className="hover:text-white">Status do Sistema</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CodeMaster. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/your-number"
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition z-50 transform hover:scale-110"
        aria-label="Contato via WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}

export default LandingPage;