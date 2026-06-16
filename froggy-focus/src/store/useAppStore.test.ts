import { useAppStore } from './useAppStore';

describe('useAppStore — баллы и награды', () => {
  // Перед каждым тестом приводим хранилище в известное состояние
  beforeEach(() => {
    useAppStore.setState({ balance: 100, transactions: [] });
  });

  it('earnPoints увеличивает баланс на нужное число', () => {
    useAppStore.getState().earnPoints(15, undefined, 'тестовая задача');
    expect(useAppStore.getState().balance).toBe(115);
  });

  it('earnPoints записывает транзакцию в историю', () => {
    useAppStore.getState().earnPoints(10);
    const tx = useAppStore.getState().transactions[0];
    expect(tx.amount).toBe(10);
    expect(tx.type).toBe('earn');
  });

  it('getAffordableRewards возвращает только награды по карману', () => {
    useAppStore.setState({
      balance: 50,
      rewards: [
        { id: '1', title: 'дешёвая', cost: 30, status: 'available' } as any,
        { id: '2', title: 'дорогая', cost: 80, status: 'available' } as any,
      ],
    });
    const affordable = useAppStore.getState().getAffordableRewards();
    expect(affordable).toHaveLength(1);
    expect(affordable[0].id).toBe('1');
  });
});