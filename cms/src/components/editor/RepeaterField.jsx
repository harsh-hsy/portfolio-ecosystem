import { useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiCopy,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

import ConfirmDialog from "./ConfirmDialog";
import FormField from "./FormField";

function RepeaterField({
  label,
  items = [],
  onChange,
  createItem = () => "",
  duplicateItem,
  getItemKey = (item, index) => item?.id || index,
  renderItem,
  addLabel = "Add item",
  itemLabel = "Item",
  compact = false,
  className = "",
  maxItems,
  emptyMessage = "No items added yet.",
}) {
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);

  function updateItem(index, nextItem) {
    onChange(
      items.map((item, itemIndex) =>
        itemIndex === index
          ? typeof nextItem === "function"
            ? nextItem(item)
            : nextItem
          : item,
      ),
    );
  }

  function moveItem(index, direction) {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= items.length) return;

    const nextItems = [...items];
    [nextItems[index], nextItems[nextIndex]] = [
      nextItems[nextIndex],
      nextItems[index],
    ];
    onChange(nextItems);
  }

  function copyItem(index) {
    if (!duplicateItem || (Number.isFinite(maxItems) && items.length >= maxItems)) return;

    const nextItems = [...items];
    nextItems.splice(index + 1, 0, duplicateItem(items[index], index));
    onChange(nextItems);
  }

  function deleteItem() {
    onChange(items.filter((_, index) => index !== pendingDeleteIndex));
    setPendingDeleteIndex(null);
  }

  return (
    <fieldset
      className={[
        "repeater-field",
        compact ? "repeater-field--compact" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <legend className="form-label">{label}</legend>

      <div className="repeater-field__list">
        {items.length ? (
          items.map((item, index) => (
            <div className="repeater-item" key={getItemKey(item, index)}>
              <div className="repeater-item__content">
                {renderItem ? (
                  renderItem({
                    item,
                    index,
                    updateItem: (nextItem) => updateItem(index, nextItem),
                  })
                ) : (
                  <FormField
                    label={`${itemLabel} ${index + 1}`}
                    value={item}
                    onChange={(event) => updateItem(index, event.target.value)}
                  />
                )}
              </div>

              <div className="repeater-item__actions">
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move item ${index + 1} up`}
                  title="Move up"
                >
                  <FiArrowUp aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                  aria-label={`Move item ${index + 1} down`}
                  title="Move down"
                >
                  <FiArrowDown aria-hidden="true" />
                </button>
                {duplicateItem ? (
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => copyItem(index)}
                    disabled={Number.isFinite(maxItems) && items.length >= maxItems}
                    aria-label={`Duplicate item ${index + 1}`}
                    title="Duplicate item"
                  >
                    <FiCopy aria-hidden="true" />
                  </button>
                ) : null}
                <button
                  type="button"
                  className="icon-button icon-button--danger"
                  onClick={() => setPendingDeleteIndex(index)}
                  aria-label={`Delete item ${index + 1}`}
                  title="Delete item"
                >
                  <FiTrash2 aria-hidden="true" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="repeater-field__empty">{emptyMessage}</p>
        )}
      </div>

      <button
        type="button"
        className="btn btn-secondary repeater-field__add"
        onClick={() => onChange([...items, createItem()])}
        disabled={Number.isFinite(maxItems) && items.length >= maxItems}
      >
        <FiPlus aria-hidden="true" />
        {addLabel}
      </button>

      <ConfirmDialog
        isOpen={pendingDeleteIndex !== null}
        title="Delete this item?"
        message="The item will be removed from this form. Save your changes to update the portfolio."
        onConfirm={deleteItem}
        onCancel={() => setPendingDeleteIndex(null)}
      />
    </fieldset>
  );
}

export default RepeaterField;
