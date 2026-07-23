import FormField from "./FormField";
import RepeaterField from "./RepeaterField";

function StructuredEntriesEditor({
  className = "",
  label,
  items,
  onChange,
  addLabel,
  itemName,
  maxItems = 12,
}) {
  return (
    <RepeaterField
      className={`structured-entries-editor ${className}`.trim()}
      label={label}
      items={items}
      onChange={onChange}
      createItem={() => ({ title: "", label: "", period: "", body: "" })}
      getItemKey={(_, index) => index}
      addLabel={items.length >= maxItems ? `Maximum ${maxItems} Entries` : addLabel}
      itemLabel={itemName}
      maxItems={maxItems}
      renderItem={({ item, updateItem }) => (
        <div className="structured-entry-fields">
          <FormField
            label="Title"
            className="structured-entry-title"
            value={item.title}
            onChange={(event) =>
              updateItem({ ...item, title: event.target.value })
            }
            maxLength={120}
            required
          />
          <FormField
            label="Category / Label"
            value={item.label}
            onChange={(event) =>
              updateItem({ ...item, label: event.target.value })
            }
            maxLength={40}
            required
          />
          <FormField
            label="Status / Period"
            value={item.period}
            onChange={(event) =>
              updateItem({ ...item, period: event.target.value })
            }
            maxLength={60}
            required
          />
          <FormField
            label="Description"
            as="textarea"
            className="structured-entry-description"
            value={item.body}
            onChange={(event) =>
              updateItem({ ...item, body: event.target.value })
            }
            maxLength={500}
            required
          />
        </div>
      )}
    />
  );
}

export default StructuredEntriesEditor;
