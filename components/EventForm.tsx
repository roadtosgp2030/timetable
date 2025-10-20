import { useState, forwardRef } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { EventFormData } from '@/utils/task'

interface EventFormProps {
  initialData?: Partial<EventFormData>
  onSubmit: (data: EventFormData) => void
  onCancel: () => void
  isEditing?: boolean
}

export const EventForm = forwardRef<HTMLFormElement, EventFormProps>(
  function EventForm(
    { initialData, onSubmit, onCancel, isEditing = false },
    ref
  ) {
    const [formData, setFormData] = useState<EventFormData>({
      title: initialData?.title || '',
      description: initialData?.description || '',
      start: initialData?.start || new Date().toISOString().slice(0, 16),
      end:
        initialData?.end ||
        new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
      allDay: initialData?.allDay || false,
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!formData.title.trim()) {
        alert('Please enter a title for the event')
        return
      }
      onSubmit(formData)
    }

    return (
      <form ref={ref} onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <Label htmlFor='title'>Event Title *</Label>
          <Input
            id='title'
            type='text'
            value={formData.title}
            onChange={e =>
              setFormData(prev => ({ ...prev, title: e.target.value }))
            }
            placeholder='Enter event title'
            required
          />
        </div>

        <div>
          <Label htmlFor='description'>Description</Label>
          <textarea
            id='description'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={formData.description}
            onChange={e =>
              setFormData(prev => ({ ...prev, description: e.target.value }))
            }
            placeholder='Enter event description (optional)'
            rows={3}
          />
        </div>

        <div className='flex items-center space-x-2'>
          <input
            id='allDay'
            type='checkbox'
            checked={formData.allDay}
            onChange={e =>
              setFormData(prev => ({ ...prev, allDay: e.target.checked }))
            }
            className='rounded'
          />
          <Label htmlFor='allDay'>All Day Event</Label>
        </div>

        {!formData.allDay && (
          <>
            <div>
              <Label htmlFor='start'>Start Date & Time</Label>
              <Input
                id='start'
                type='datetime-local'
                value={formData.start}
                onChange={e =>
                  setFormData(prev => ({ ...prev, start: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor='end'>End Date & Time</Label>
              <Input
                id='end'
                type='datetime-local'
                value={formData.end}
                onChange={e =>
                  setFormData(prev => ({ ...prev, end: e.target.value }))
                }
                required
              />
            </div>
          </>
        )}

        {formData.allDay && (
          <div>
            <Label htmlFor='startDate'>Date</Label>
            <Input
              id='startDate'
              type='date'
              value={formData.start.split('T')[0]}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  start: e.target.value + 'T00:00',
                  end: e.target.value + 'T23:59',
                }))
              }
              required
            />
          </div>
        )}

        <div className='flex justify-end space-x-2 pt-4'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit'>
            {isEditing ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </form>
    )
  }
)
