export async function GET(request: Request) {
  // Simulate fetching tasks from a database
  const tasks = [
    { id: '1', title: 'Task 1', start: '2024-07-01', end: '2024-07-02' },
    { id: '2', title: 'Task 2', start: '2024-07-03', end: '2024-07-04' },
  ]
  return new Response(JSON.stringify(tasks), {
    headers: { 'Content-Type': 'application/json' },
  })
}
