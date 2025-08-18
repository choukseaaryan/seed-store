# Keyboard Navigation Guide

The Seed Store application is designed to be fully keyboard-accessible, allowing you to navigate and interact with all features using only your keyboard.

## Quick Start

- **Press `Ctrl+K` (or `Cmd+K` on Mac)** to toggle keyboard mode
- **Press `Ctrl+/` (or `Cmd+/` on Mac)** to view all available keyboard shortcuts

## Global Keyboard Shortcuts

### Navigation
- `Ctrl+1` - Go to Dashboard
- `Ctrl+2` - Go to Products
- `Ctrl+3` - Go to POS (Point of Sale)
- `Ctrl+4` - Go to Customers
- `Ctrl+5` - Go to Bills
- `Ctrl+6` - Go to Suppliers

### Actions
- `Ctrl+N` - New Sale (when on POS page)
- `Ctrl+S` - Save current form/data
- `Ctrl+K` - Toggle keyboard mode
- `Ctrl+/` - Show keyboard shortcuts help

## Keyboard Mode Navigation

When keyboard mode is active (indicated by a green keyboard icon in the header):

### Element Navigation
- **Tab** - Move to next focusable element
- **Shift+Tab** - Move to previous focusable element
- **↑/↓ Arrow Keys** - Navigate between focusable elements
- **Enter** or **Space** - Activate focused element
- **Escape** - Close modals, panels, or return to previous state

### Form Navigation
- **Tab** - Next form field
- **Shift+Tab** - Previous form field
- **Enter** - Submit form or activate button
- **Escape** - Cancel or close form

### List/Table Navigation
- **↑/↓ Arrow Keys** - Navigate between items
- **Home** - Go to first item
- **End** - Go to last item
- **Enter** - Select/activate item
- **Escape** - Exit list view

## Page-Specific Shortcuts

### Login Page
- **Tab** - Navigate between email and password fields
- **Enter** - Submit login form
- **Escape** - Clear form

### Dashboard
- **Tab** - Navigate between dashboard elements
- **Enter** - Activate buttons and links

### POS (Point of Sale)
- **Ctrl+N** - Start new sale
- **Tab** - Navigate between product search, quantity, and payment fields
- **Enter** - Add item to cart or complete sale
- **Escape** - Cancel current sale

### Product Management
- **Tab** - Navigate between product fields
- **Enter** - Save product or activate buttons
- **Escape** - Cancel editing

## Accessibility Features

### Visual Indicators
- **Focus Ring** - Blue outline shows currently focused element
- **Keyboard Mode Indicator** - Green icon in header when keyboard mode is active
- **Hover States** - Visual feedback for interactive elements

### Screen Reader Support
- All interactive elements have proper ARIA labels
- Form fields include descriptive labels
- Navigation elements provide context information

## Best Practices

1. **Start with Tab Navigation** - Use Tab to move between major sections
2. **Use Arrow Keys for Lists** - Navigate within lists and tables using arrow keys
3. **Learn Global Shortcuts** - Memorize the most common shortcuts (Ctrl+1-6 for navigation)
4. **Check Keyboard Mode** - Ensure keyboard mode is active for enhanced navigation
5. **Use Escape** - Escape key closes modals and returns to previous state

## Troubleshooting

### Keyboard Navigation Not Working
- Ensure keyboard mode is active (green icon in header)
- Check if you're in a form field (Tab behavior may differ)
- Try refreshing the page if shortcuts become unresponsive

### Focus Not Visible
- Look for the blue focus ring around elements
- Ensure keyboard mode is enabled
- Check browser accessibility settings

### Shortcuts Conflict
- Some shortcuts may conflict with browser or system shortcuts
- Use `Ctrl+/` to view all available shortcuts
- Customize shortcuts in browser settings if needed

## Customization

The keyboard navigation system can be customized by:
- Modifying the `KeyboardContext.tsx` file
- Adding new shortcuts in the context
- Customizing focus behavior in `FocusableElement.tsx`

## Support

If you encounter issues with keyboard navigation:
1. Check this guide for common solutions
2. Ensure keyboard mode is enabled
3. Try refreshing the page
4. Contact support with specific error details

---

**Remember**: The goal is to make the application as efficient to use with a keyboard as it is with a mouse. Practice the shortcuts regularly to build muscle memory!
