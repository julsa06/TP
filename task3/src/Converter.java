// Абдрашитова Юлия, гр.2743

import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.FileNotFoundException;
import java.text.NumberFormat;
import java.util.Locale;
import java.util.Scanner;
import java.util.Vector;

import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;
import javax.swing.SwingWorker;

public class Converter extends JFrame {

	private static final int CountRow = 5; // количество строк
	private final String dataFile = "data.in"; // имя файла с данными
	private RowPanel[] rowPanels; // массив панелей строк
	private final Currency empty = new Currency("", "нет валюты", 0);
	private final Currency ruble = new Currency("RUR", "Российский рубль", 1);

	public static void main(final String[] args) {

		SwingUtilities.invokeLater(new Runnable() {

			@Override
			public void run() {
				Converter converter = new Converter();
				converter.createAndShowGui();
				converter.new Reader().execute();
			}

		});
	}

	Converter() {
		super("Конвертер валют");
	}

	// создает окно
	private void createAndShowGui() {
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		Box box = Box.createVerticalBox(); // основная панель
		rowPanels = new RowPanel[CountRow];

		// добавляем панели с валютами на основную
		for (int i = 0; i < CountRow; i++) {
			rowPanels[i] = new RowPanel();
			box.add(rowPanels[i]);
		}

		setContentPane(box);
		pack();
		setResizable(false);
		setLocationRelativeTo(null);
		setVisible(true);
	}

	// обработка данных
	private class Reader extends SwingWorker<Object, Object> {

		@Override
		protected Object doInBackground() throws Exception {
			try {
				Scanner scan = new Scanner(new File(dataFile));
				while (scan.hasNext()) {
					Thread.sleep(2000); // искуственная задержка получения
										// данных
					String key = scan.next();
					String rateString = scan.next();
					String name = scan.nextLine();

					// переводит курс из строки в число или создает окно ошибки,
					// если не вышло
					try {
						double rate = Double.parseDouble(rateString);
						if (rate <= 0) {
							throw new NumberFormatException();
						}
						for (RowPanel panel : rowPanels) {
							panel.addCurrency(new Currency(key, name, rate));
						}
					} catch (NumberFormatException e) {
						JOptionPane.showMessageDialog(null,
								"Некорректные данные", "Ошибка",
								JOptionPane.ERROR_MESSAGE);
						System.exit(-1);
					}
					pack();
				}
			} catch (FileNotFoundException e) {
				e.printStackTrace();
				JOptionPane.showMessageDialog(null, "Файл с данными не найден",
						"Ошибка", JOptionPane.ERROR_MESSAGE);
				System.exit(-1);
			}
			return null;
		}
	}

	// панель валютной строчки
	private class RowPanel extends JPanel {
		private JComboBox<Currency> comboBox; // список валют
		private Field text; // ввод данных
		private JButton button; // кнопка пересчета

		RowPanel() {
			comboBox = new JComboBox<Currency>();
			comboBox.addItem(empty);
			comboBox.addItem(ruble);

			button = new JButton("Пересчитать");
			button.addActionListener(new Recalculate(this));
			text = new Field();

			setLayout(new FlowLayout());

			add(comboBox);
			add(text);
			add(button);
		}

		// возвращает выбранную пользователем валюту
		Currency getCurrency() {
			return (Currency) comboBox.getSelectedItem();
		}

		// возвращает поле для ввода
		Field getField() {
			return text;
		}

		// добавляет валюту в список
		void addCurrency(Currency currency) {
			comboBox.addItem(currency);
		}

		// поле для ввода
		class Field extends JTextField {
			Field() {
				super(6);
			}

			// возвращает введенное число
			public double get() {
				return Double.parseDouble(getText());
			}
		}

	}

	// слушатель кнопки пересчета
	private class Recalculate implements ActionListener {
		private RowPanel panel; // панель с кнопкой
		private NumberFormat nf; // формат вывода

		Recalculate(RowPanel panel) {
			this.panel = panel;
			nf = NumberFormat.getInstance(Locale.US);
			nf.setMaximumFractionDigits(2);
			nf.setGroupingUsed(false);
		}

		@Override
		public void actionPerformed(ActionEvent e) {
			// валюта не выбрана
			if (panel.getCurrency() == empty) {
				JOptionPane.showMessageDialog(null, "Валюта не выбрана.",
						"Ошибка", JOptionPane.ERROR_MESSAGE);
			}

			// пустой ввод
			if (panel.getField().getText().equals("")) {
				clear();
				return;
			}

			try {

				double rub = panel.getField().get()
						* panel.getCurrency().getRate(); // значение в рублях
				// ввели отрицательное число
				if (rub < 0) {
					JOptionPane.showMessageDialog(null,
							"Некорректный ввод: отрицательное число.",
							"Ошибка", JOptionPane.ERROR_MESSAGE);
					return;
				}
				// обновляет все поля
				for (RowPanel rowPanel : rowPanels) {
					if (rowPanel != panel) {
						if (rowPanel.getCurrency() == empty) { // если валюты
																// нет
							rowPanel.getField().setText("");
						} else {
							rowPanel.getField()
									.setText(
											nf.format(rub
													/ rowPanel.getCurrency()
															.getRate()));
						}
					}
				}
			} catch (NumberFormatException ex) { // пользователь ввел не число
				JOptionPane.showMessageDialog(null,
						"Некорректный ввод: не является числом.", "Ошибка",
						JOptionPane.ERROR_MESSAGE);
			}
		}
	}

	// очищает все поля
	private void clear() {
		for (RowPanel rowPanel : rowPanels) {
			rowPanel.getField().setText("");
		}
	}

	// валюта
	private class Currency {
		private String key; // код валюты
		private String name; // название валюты
		private double rate; // курс к рублю

		Currency(String key, String name, double rate) {
			this.key = key;
			this.name = name;
			this.rate = rate;
		}

		@Override
		public String toString() {
			return key + "(" + name + ")";
		}

		// возвращает курс
		public double getRate() {
			return rate;
		}
	}
}

// Данные представляют собой таблицу курсов иностранных валют к рублю. Данные
// представлены в текстовом файле, который содержит список валют в виде строк,
// содержащих код и название валюты, а также курс валюты к рублю.
// Программа должна позволять пользователю на основании этих данных рассчитывать
// кросс-курсы разных валют (включая российский рубль).
// Всего в диалоге задействовано 5 строк с элементами управления. Пользователь
// вводит в некоторых строках интересующие его валюты, например, как показано на
// картинке - российский рубль, доллар США и датскую крону (выбор в остальных
// строках - строка “(нет валюты)”), далее он вводит в одной из строк сумму в
// указанной валюте и нажимает на кнопку “Пересчитать”. Если данные введены
// правильно, то программа рассчитывает соответствующие суммы в валютах
// остальных выбранных стран и выводит результаты в соответствующих окнах ввода.
// Если данные введены неправильно (ошибка в формате числа, не выбрана валюта,
// отрицательная сумма и т.п.), то пользователю сообщают об этом в отдельном
// информационном модальном окне.