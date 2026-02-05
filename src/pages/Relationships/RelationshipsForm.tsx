/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
};

const initialState = {
  legalName: "",
  displayName: "",
  shortName: "",
  role: "",
  status: "",
  category: "",
};

const RelationshipsForm: React.FC<Props> = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) {
      setForm(initialState);
      setErrors({});
    }
  }, [open]);

  const update = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.legalName.trim()) e.legalName = "Legal name is required";
    if (!form.displayName.trim()) e.displayName = "Display name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave?.(form);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <Modal
          open={open}
          footer={null}
          closable={false}
          centered
          width={760}
          onCancel={onClose}
          maskClosable
          bodyStyle={{
            padding: 0,
            background: "transparent",
          }}
          className="!bg-transparent"
        >
          <div className="px-4 pt-2 pb-2 border-b border-gray-200/60">
            <h2 className="text-lg font-black text-gray-900">
              Add Counterparty
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create and manage parties involved in contracts
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-2 gap-5">
              <Field
                label="Legal Name"
                required
                value={form.legalName}
                error={errors.legalName}
                onChange={(v) => update("legalName", v)}
              />
              <Field
                label="Display Name"
                required
                value={form.displayName}
                error={errors.displayName}
                onChange={(v) => update("displayName", v)}
              />

              <Field
                label="Short Name"
                value={form.shortName}
                onChange={(v) => update("shortName", v)}
              />
              <Field
                label="Role"
                value={form.role}
                onChange={(v) => update("role", v)}
              />

              <Field
                label="Status"
                value={form.status}
                onChange={(v) => update("status", v)}
              />
              <Field
                label="Category"
                value={form.category}
                onChange={(v) => update("category", v)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200/60 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="
                  px-4 py-2
                  text-sm font-semibold
                  text-gray-600
                  hover:text-gray-900
                  transition
                "
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="
                  px-5 py-2.5
                  rounded-xl
                  text-sm font-bold
                  text-white
                  bg-gradient-to-r from-emerald-500 to-emerald-600
                  shadow-md
                  hover:shadow-lg
                  hover:scale-[1.02]
                  transition-all
                "
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default RelationshipsForm;

/* ------------------ Field ------------------ */

const Field = ({
  label,
  value,
  onChange,
  error,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        h-11 px-3 rounded-xl
        border bg-white
        text-sm font-medium
        outline-none transition
        ${
          error
            ? "border-red-400 focus:ring-2 focus:ring-red-200"
            : "border-gray-300 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
        }
      `}
    />

    {error && <span className="text-xs font-medium text-red-500">{error}</span>}
  </div>
);
