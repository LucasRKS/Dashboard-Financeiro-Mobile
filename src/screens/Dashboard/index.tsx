import React, { useRef, useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useAuth } from '../../hooks/auth';

import api from '../../services/api';
import RNPickerSelect from '../../components/RNPickerSelect/RNPickerSelect';
import Button from '../../components/Button';

import {
  MainCardContainer,
  CardContainer,
  Container,
  CardTitle,
  MainCardTitle,
  TextPercentage,
  TextFilterPlaceholder,
  CardData,
  CardIconContainer,
  FilterButton,
  DataText,
  ContainerData,
  ButtonDataFiltro,
  SignOutButton,
  FilterContainer,
  ActionsContainer,
} from './styles';

const Dashboard: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { signOut, clients } = useAuth();
  const [pickerOptions, setPickerOption] = useState([
    { value: '', label: 'Conta' },
  ]);
  const [clientData, setClientData] = useState(null);
  const [dataInicial, setDataInicial] = useState(new Date());
  const [dataInicialFormatada, setDataInicialFormatada] = useState('');
  const [dataFinalFormatada, setDataFinalFormatada] = useState('');
  const [dataFinal, setDataFinal] = useState(new Date());
  const [showInicial, setShowInicial] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [lucroLiquidoColor, setLucroLiquidoColor] = useState('black');
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const expositionOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'gold_pro', label: 'Premium' },
    { value: 'gold_special', label: 'Clássico' },
    { value: 'fulfillment', label: 'Full' },
    { value: 'mshops', label: 'Mercado Shops' },
  ];
  const paymentOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Confirmado' },
    { value: 'inative', label: 'Cancelado' },
  ];
  const formatoOptions = [
    { value: 'mp', label: 'Formato Mercado Pago' },
    { value: 'ml', label: 'Formato Mercado Livre' },
  ];

  const handleFilter = (data: any) => {
    setLoading(true);
    async function getClientInfo() {
      const response = await api.get(
        `ReportsSales/FinancialIndicatorsJson?filterSearch&filterListingType=${data.exposicao}&itemStatus=${data.pagamento}&startDate=${dataInicialFormatada}&endDate=${dataFinalFormatada}&showType=${data.formato}&accounts=${data.conta}`,
      );
      setClientData(response.data);
      const clientInfo = response.data;
      if (
        clientInfo.salesProfitTotal.perc_Profitability >
        clientInfo.salesProfitTotal.idealProfitability
      ) {
        setLucroLiquidoColor('blue');
      } else if (
        clientInfo.salesProfitTotal.perc_Profitability > 0 &&
        clientInfo.salesProfitTotal.perc_Profitability <
          clientInfo.salesProfitTotal.idealProfitability
      ) {
        setLucroLiquidoColor('red');
      } else {
        setLucroLiquidoColor('red');
      }

      setLoading(false);
    }
    getClientInfo();
  };

  const formataData = data => {
    const dia = data.getDate().toString();
    const diaF = dia.length == 1 ? `0${dia}` : dia;
    const mes = (data.getMonth() + 1).toString(); // +1 pois no getMonth Janeiro começa com zero.
    const mesF = mes.length == 1 ? `0${mes}` : mes;
    const anoF = data.getFullYear();
    return `${diaF}/${mesF}/${anoF}`;
  };

  const tiraAno = data => {
    data.setFullYear(data.getFullYear() - 1);
    return data;
  };

  const handleSignOut = () => signOut();

  const handleOpenFilter = () => {
    isOpen === true ? setIsOpen(false) : setIsOpen(true);
  };

  const showDatepickerInicial = () => {
    setShowInicial(true);
  };
  const showDatepickerFinal = () => {
    setShowFinal(true);
  };

  const onChangeDataInicial = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDataInicial(currentDate);
    const dataFormatada = formataData(currentDate);
    setDataInicialFormatada(dataFormatada);
    setShowInicial(false);
  };
  const onChangeDataFinal = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDataFinal(currentDate);
    const dataFormatada = formataData(currentDate);
    setDataFinalFormatada(dataFormatada);
    setShowFinal(false);
  };

  useEffect(() => {
    setLoading(true);
    async function getClientInfo() {
      const dataFinalParaState = formataData(new Date());
      setDataFinalFormatada(dataFinalParaState);

      const dataInicialAnoPassado = tiraAno(new Date());
      setDataInicial(dataInicialAnoPassado);
      const dataInicialParaState = formataData(dataInicialAnoPassado);
      setDataInicialFormatada(dataInicialParaState);

      const client = clients[0];
      const response = await api.get(
        `ReportsSales/FinancialIndicatorsJson?filterSearch&filterListingType=all&itemStatus=active&startDate=${dataInicialParaState}&endDate=${dataFinalParaState}&showType=ml&accounts=${client.meliAccount_Id}`,
      );
      setClientData(response.data);
      const clientOptions: React.SetStateAction<{}[]> = [];
      clients.forEach(client => {
        clientOptions.push({
          label: client.meliAccount_Name,
          value: client.meliAccount_Id,
        });
      });

      const clientInfo = response.data;
      if (
        clientInfo.salesProfitTotal.perc_Profitability >
        clientInfo.salesProfitTotal.idealProfitability
      ) {
        setLucroLiquidoColor('blue');
      } else if (
        clientInfo.salesProfitTotal.perc_Profitability > 0 &&
        clientInfo.salesProfitTotal.perc_Profitability <
          clientInfo.salesProfitTotal.idealProfitability
      ) {
        setLucroLiquidoColor('red');
      } else {
        setLucroLiquidoColor('red');
      }

      setPickerOption(clientOptions);
      setLoading(false);
    }
    getClientInfo();
  }, [clients]);

  return (
    <Container>
      <ScrollView>
        <ActionsContainer>
          <FilterButton>
            <Icon
              name="filter"
              size={26}
              color="#FFF"
              onPress={handleOpenFilter}
            />
          </FilterButton>
          <SignOutButton>
            <Icon
              name="log-out"
              size={26}
              onPress={handleSignOut}
              color="#FFF"
            />
          </SignOutButton>
        </ActionsContainer>

        <FilterContainer isOpen={isOpen}>
          <Form
            ref={formRef}
            onSubmit={handleFilter}
            initialData={{
              conta: clients[0].meliAccount_Id,
              exposicao: 'all',
              pagamento: 'active',
              formato: 'ml',
            }}
          >
            <TextFilterPlaceholder>Conta</TextFilterPlaceholder>
            <RNPickerSelect
              name="conta"
              items={pickerOptions}
              placeholder={{}}
            />
            <TextFilterPlaceholder>Exposição</TextFilterPlaceholder>
            <RNPickerSelect
              name="exposicao"
              items={expositionOptions}
              placeholder={{}}
            />
            <TextFilterPlaceholder>Pagamento</TextFilterPlaceholder>
            <RNPickerSelect
              name="pagamento"
              items={paymentOptions}
              placeholder={{}}
            />
            <TextFilterPlaceholder>Formato</TextFilterPlaceholder>
            <RNPickerSelect
              name="formato"
              items={formatoOptions}
              placeholder={{}}
            />
            <ContainerData>
              <TextFilterPlaceholder>Data Inicial</TextFilterPlaceholder>
              <ButtonDataFiltro onPress={showDatepickerInicial}>
                <DataText>{dataInicialFormatada}</DataText>
              </ButtonDataFiltro>
              {showInicial && (
                <DateTimePicker
                  value={dataInicial}
                  mode="date"
                  onChange={onChangeDataInicial}
                />
              )}
              <TextFilterPlaceholder>Data Final</TextFilterPlaceholder>
              <ButtonDataFiltro onPress={showDatepickerFinal}>
                <DataText>{dataFinalFormatada}</DataText>
              </ButtonDataFiltro>
              {showFinal && (
                <DateTimePicker
                  value={dataFinal}
                  mode="date"
                  onChange={onChangeDataFinal}
                />
              )}
            </ContainerData>
            {!loading ? (
              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Filtrar
              </Button>
            ) : (
              <ActivityIndicator size="large" color="#F9F9F9" />
            )}
          </Form>
        </FilterContainer>

        <MainCardContainer>
          {!loading && (
            <CardIconContainer color="blue">
              <Icon name="arrow-up" size={20} color="white" />
            </CardIconContainer>
          )}
          <MainCardTitle loading={loading}>Faturamento</MainCardTitle>
          {loading ? (
            <ActivityIndicator size="large" color="#F9F9F9" />
          ) : (
            <CardData>
              {clientData.salesProfitTotal.total_amount_formated}
            </CardData>
          )}
        </MainCardContainer>

        <CardContainer>
          {!loading && (
            <CardIconContainer color="blue">
              <Icon name="arrow-up" size={20} color="white" />
            </CardIconContainer>
          )}
          <CardTitle loading={loading}>Vendas</CardTitle>
          {loading ? (
            <ActivityIndicator size="large" color="#F9F9F9" />
          ) : (
            <CardData>{clientData.salesProfitTotal.sold_Quantity}</CardData>
          )}
        </CardContainer>

        <CardContainer>
          {!loading && (
            <CardIconContainer color="blue">
              <Icon name="arrow-up" size={20} color="white" />
            </CardIconContainer>
          )}
          <CardTitle loading={loading}>Produtos Vendidos</CardTitle>
          {loading ? (
            <ActivityIndicator size="large" color="#F9F9F9" />
          ) : (
            <CardData>
              {clientData.salesProfitTotal.sold_Quantity_Total}
            </CardData>
          )}
        </CardContainer>

        <CardContainer>
          {!loading && (
            <CardIconContainer color="blue">
              <Icon name="arrow-up" size={20} color="white" />
              <TextPercentage>
                {clientData.salesProfitPercent.percentiaverageticket_formated}
              </TextPercentage>
            </CardIconContainer>
          )}
          <CardTitle loading={loading}>Ticket Médio</CardTitle>
          {loading ? (
            <ActivityIndicator size="large" color="#F9F9F9" />
          ) : (
            <CardData>
              {clientData.salesProfitTotal.averageticket_formated}
            </CardData>
          )}
        </CardContainer>

        <CardContainer>
          {!loading && (
            <CardIconContainer color="blue">
              <Icon name="arrow-up" size={20} color="white" />
              <TextPercentage>
                {clientData.salesProfitPercent.percentimeliGrossProfit_formated}
              </TextPercentage>
            </CardIconContainer>
          )}
          <CardTitle loading={loading}>Lucro Bruto</CardTitle>
          {loading ? (
            <ActivityIndicator size="large" color="#F9F9F9" />
          ) : (
            <CardData>
              {clientData.salesProfitTotal.meliGrossProfit_formated}
            </CardData>
          )}
        </CardContainer>

        <CardContainer>
          {!loading && (
            <CardIconContainer color="red">
              <Icon name="arrow-down" size={20} color="white" />
              <TextPercentage>
                {clientData.salesProfitPercent.percenticommision_formated}
              </TextPercentage>
            </CardIconContainer>
          )}
          <CardTitle loading={loading}>Comissão</CardTitle>
          {loading ? (
            <ActivityIndicator size="large" color="#F9F9F9" />
          ) : (
            <CardData>
              {clientData.salesProfitTotal.commission_formated}
            </CardData>
          )}
        </CardContainer>

        <CardContainer>
          {!loading && (
            <CardIconContainer color="red">
              <Icon name="arrow-down" size={20} color="white" />
              <TextPercentage>
                {clientData.salesProfitPercent.percenticommision5_formated}
              </TextPercentage>
            </CardIconContainer>
          )}
          <CardTitle loading={loading}>R$ 5</CardTitle>
          {loading ? (
            <ActivityIndicator size="large" color="#F9F9F9" />
          ) : (
            <CardData>
              {clientData.salesProfitTotal.commission_5_formated}
            </CardData>
          )}
        </CardContainer>

        <CardContainer>
          {!loading && (
            <CardIconContainer color="red">
              <Icon name="arrow-down" size={20} color="white" />
              <TextPercentage>
                {
                  clientData.salesProfitPercent
                    .percentifreeShippingCost_formated
                }
              </TextPercentage>
            </CardIconContainer>
          )}
          <CardTitle loading={loading}>Frete</CardTitle>
          {loading ? (
            <ActivityIndicator size="large" color="#F9F9F9" />
          ) : (
            <CardData>
              {clientData.salesProfitTotal.freeShippingCost_formated}
            </CardData>
          )}
        </CardContainer>

        <CardContainer>
          {!loading && (
            <CardIconContainer color="red">
              <Icon name="arrow-down" size={20} color="white" />
              <TextPercentage>
                {clientData.salesProfitPercent.percenticost_formated}
              </TextPercentage>
            </CardIconContainer>
          )}
          <CardTitle loading={loading}>CMV</CardTitle>
          {loading ? (
            <ActivityIndicator size="large" color="#F9F9F9" />
          ) : (
            <CardData>{clientData.salesProfitTotal.cost_formated}</CardData>
          )}
        </CardContainer>

        <CardContainer>
          {!loading && (
            <CardIconContainer color="red">
              <Icon name="arrow-down" size={20} color="white" />
              <TextPercentage>
                {clientData.salesProfitPercent.percentifixedCost_formated}
              </TextPercentage>
            </CardIconContainer>
          )}
          <CardTitle loading={loading}>Custo Fixo</CardTitle>
          {loading ? (
            <ActivityIndicator size="large" color="#F9F9F9" />
          ) : (
            <CardData>
              {clientData.salesProfitTotal.fixedCost_formated}
            </CardData>
          )}
        </CardContainer>

        <CardContainer>
          {!loading && (
            <CardIconContainer color="red">
              <Icon name="arrow-down" size={20} color="white" />
              <TextPercentage>
                {clientData.salesProfitPercent.percentitax_formated}
              </TextPercentage>
            </CardIconContainer>
          )}
          <CardTitle loading={loading}>Imposto</CardTitle>
          {loading ? (
            <ActivityIndicator size="large" color="#F9F9F9" />
          ) : (
            <CardData>{clientData.salesProfitTotal.tax_formated}</CardData>
          )}
        </CardContainer>

        <CardContainer>
          {!loading && (
            <CardIconContainer color="blue">
              <Icon name="arrow-up" size={20} color="white" />
              <TextPercentage>
                {clientData.salesProfitTotal.perc_Profitability_formated}
              </TextPercentage>
            </CardIconContainer>
          )}
          <CardTitle loading={loading}>Lucro Líquido</CardTitle>
          {loading ? (
            <ActivityIndicator size="large" color="#F9F9F9" />
          ) : (
            <CardData color={lucroLiquidoColor}>
              {clientData.salesProfitTotal.meliProfit_formated}
            </CardData>
          )}
        </CardContainer>
      </ScrollView>
    </Container>
  );
};

export default Dashboard;
