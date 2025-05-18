# 💰 FinMan — Your AI-Powered Personal Finance Assistant

**FinMan** is an intelligent personal finance management system that empowers users to take control of their financial life. From tracking income and expenses to setting smart savings goals and receiving personalized AI-driven financial advice — FinMan combines the power of modern software architecture with real-world money management needs.

> Designed using SOLID principles and software design patterns for reliability, flexibility, and long-term scalability.

---

## 🌟 Key Features

### 🔍 Intelligent Transaction Categorization
FinMan automatically classifies user transactions into categories such as:
- **Income** (e.g., salary, freelance)
- **Expenses** (e.g., groceries, rent, dining)
- **Investments** (e.g., stocks, mutual funds)
- **Savings** (e.g., deposits)

Leverages AI algorithms and pattern recognition to improve categorization accuracy over time based on user behavior and transaction descriptions.

---

### 🎯 Goal-Oriented Financial Planning
Users can create, monitor, and adjust financial goals such as:
- Saving for a vacation
- Building an emergency fund
- Buying a car or home

Each goal supports:
- Target amount
- Deadline or duration
- Progress tracking
- Sub-goals (via Composite pattern)

---

### 🤖 AI-Powered Financial Recommendations
FinMan acts as your financial advisor by analyzing your data and recommending actions such as:
- Reducing overspending in specific categories
- Rebalancing your investment portfolio
- Restructuring your budget based on goals or income
- Switching between conservative and aggressive strategies depending on your profile

Built using the **Strategy Pattern** to switch dynamically between recommendation logics.

---

### 📊 Visual Financial Reporting
FinMan transforms your financial data into interactive visualizations to help you make smarter decisions:
- **Pie charts** for income vs. expenses
- **Line graphs** showing investment growth over time
- **Bar charts** for savings goal progress

---

### 🔁 Adaptive Financial Modes (State Pattern)
FinMan supports multiple financial "modes" based on your situation or preference:
- **Saving Mode**: Tightens budget, conservative advice
- **Spending Mode**: Flags non-essential expenses
- **Investing Mode**: Encourages calculated investments
- **Debt Reduction Mode** *(optional)*: Focuses on loan management

These states change the system’s behavior and recommendations dynamically, using the **State Pattern**.

---

## 🛠️ Behind the Scenes: Tech & Design

### 🧱 Architecture Highlights

- ✅ High Cohesion: Each module does one job well (SRP)
- ✅ Extensible Interfaces: New strategies and states can be added without altering existing code (OCP, ISP)
- ✅ Flexible & Maintainable: Easily adapts to new requirements or business rules

### 🎨 Design Patterns Used

| Pattern        | Purpose |
|----------------|---------|
| **Singleton**  | Ensures a single shared database connection |
| **Strategy**   | Switches between budgeting/investment strategies |
| **State**      | Manages user financial modes dynamically |
| **Composite**  | Manages complex financial goals and sub-goals |

---

## 🚀 Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/finman.git
   cd finman
