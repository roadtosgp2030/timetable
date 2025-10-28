# Budget Feature

A comprehensive budget management system that allows users to create and track monthly budgets with spending items.

## Features

- **Monthly Budget Creation**: Create budgets for specific months and years
- **Spending Categories**: Organize expenses into predefined categories
- **Real-time Tracking**: Update spending amounts and see progress in real-time
- **Visual Progress Indicators**: Color-coded progress bars and status indicators
- **Budget Overview**: Statistics and insights across all budgets
- **Responsive Design**: Works on desktop and mobile devices

## Components

### BudgetForm

Interactive form for creating new budgets with:

- Budget name and total amount
- Month and year selection
- Dynamic budget items with categories
- Validation and error handling

### BudgetCard

Displays individual budget information with:

- Overall budget progress
- Individual item tracking
- Inline spending amount editing
- Visual progress indicators
- Delete functionality

### BudgetOverview

Dashboard showing:

- Total budgets created
- Aggregate spending statistics
- Current month budget highlight
- Over-budget indicators

## Database Schema

The budget feature uses two main models:

### Budget

- `id`: Unique identifier
- `name`: Budget name/description
- `month`: Month (1-12)
- `year`: Year
- `totalBudget`: Overall budget amount
- `userId`: Owner reference
- `items`: Related budget items

### BudgetItem

- `id`: Unique identifier
- `name`: Item name/description
- `category`: Spending category
- `budgetAmount`: Allocated amount
- `spentAmount`: Actual spending
- `budgetId`: Parent budget reference

## Usage

1. **Create Budget**: Click "Create New Budget" and fill out the form
2. **Add Items**: Add spending categories with allocated amounts
3. **Track Spending**: Edit spending amounts directly on budget cards
4. **Monitor Progress**: View visual progress bars and statistics
5. **Manage Budgets**: Delete budgets when no longer needed

## Categories

Available spending categories:

- Food & Dining
- Transportation
- Entertainment
- Shopping
- Bills & Utilities
- Healthcare
- Education
- Travel
- Other

## Installation & Setup

1. **Database Migration**: Run Prisma migration to create budget tables

   ```bash
   npx prisma migrate dev --name add-budget-models
   ```

2. **Generate Client**: Update Prisma client

   ```bash
   npx prisma generate
   ```

3. **Access**: Navigate to `/budgets` in the application

## API Endpoints

- `GET /api/budgets` - Fetch user's budgets
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/[id]` - Update budget
- `DELETE /api/budgets/[id]` - Delete budget
- `PUT /api/budgets/items/[id]` - Update budget item spending

## Development Notes

- Currently uses mock data for demonstration
- Database operations are commented out until Prisma client is properly generated
- All CRUD operations are implemented but need database integration
- Form validation and error handling are in place
- Responsive design works on all screen sizes

## Future Enhancements

- Budget templates for recurring monthly budgets
- Spending analytics and trends
- Budget alerts and notifications
- Export functionality (PDF, CSV)
- Budget sharing and collaboration
- Integration with bank accounts/credit cards
- Recurring expense tracking
- Budget vs actual reporting
