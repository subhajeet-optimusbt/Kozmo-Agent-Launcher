/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, type JSX } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  Button,
  Switch,
  Radio,
  message,
} from "antd";
import { UploadOutlined, LeftOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useNavigate } from "react-router-dom";
type FormValues = {
  area?: string;
  type?: string;
  title?: string;
  number?: string;
  counterparty?: string;
  company?: string;
  owner?: string;
  origin?: string;
  termType?: "fixed" | "auto" | "evergreen";
  startDate?: unknown;
  endDate?: unknown;
  noticePeriod?: number;
  totalValue?: number;
  currency?: string;
  autoRenew?: boolean;
  documents?: UploadFile[];
};

const { Dragger } = Upload;
const { TextArea } = Input;

function Section({
  title,
  children,
  className = "",
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`bg-gradient-to-br from-white to-gray-50/30 rounded-2xl p-8 border border-gray-100/50 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
    >
      <h3 className="text-base font-bold text-gray-900 mb-6 tracking-tight flex items-center gap-2">
        <span className="w-1.5 h-5 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
        {title}
      </h3>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{children}</div>
  );
}

export default function CreateContractPage(): JSX.Element {
  const [form] = Form.useForm<FormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/contracts");
  };

  const onFinish = async (values: FormValues) => {
    try {
      setSaving(true);
      console.log("Create contract payload:", {
        ...values,
        documents: fileList,
      });
      await new Promise((r) => setTimeout(r, 700));
      message.success("Contract created successfully!");
    } catch (err) {
      message.error("Failed to create contract");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />
      <div className="mx-8 my-4">
        {/* Fixed Header */}
        {/* <div className="flex-none bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"> */}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={<LeftOutlined className="text-gray-500" />}
              onClick={handleBack}
              className="hover:bg-gray-100 rounded-xl transition-all duration-200"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create New Contract
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Configure contract metadata and upload documents
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Button
              onClick={handleBack}
              className="rounded-xl px-5 hover:bg-gray-50 transition-all duration-200 border-gray-200"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                form.validateFields().then((vals) => {
                  console.log("Draft:", vals);
                  message.success("Draft saved locally");
                });
              }}
              className="rounded-xl px-5 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 hover:shadow-sm transition-all duration-200"
            >
              Save Draft
            </Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              className="rounded-xl px-8 bg-gradient-to-r from-emerald-600 to-teal-600 border-0 shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-300"
              loading={saving}
            >
              Submit
            </Button>
          </div>
        </div>

        {/* </div> */}

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className=" px-4 py-4">
            <div>
              <Form<FormValues>
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ autoRenew: false, termType: "fixed" }}
              >
                <div className="h-full overflow-y-auto px-4 py-4"></div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Left Column - Main Contract Info */}
                  <div className="xl:col-span-2 space-y-6">
                    {/* CONTRACT BASICS */}
                    <Section title="Contract Basics">
                      <TwoCol>
                        <Form.Item
                          label={
                            <span className="text-sm font-semibold text-gray-700">
                              Area
                            </span>
                          }
                          name="area"
                          rules={[
                            {
                              required: true,
                              message: "Please select an area",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select area"
                            className="rounded-lg"
                            options={[
                              { label: "Sales", value: "sales" },
                              { label: "Procurement", value: "procurement" },
                            ]}
                          />
                        </Form.Item>

                        <Form.Item
                          label={
                            <span className="text-sm font-semibold text-gray-700">
                              Type
                            </span>
                          }
                          name="type"
                          rules={[
                            {
                              required: true,
                              message: "Please select a contract type",
                            },
                          ]}
                        >
                          <Select
                            placeholder="NDA / MSA / SOW"
                            className="rounded-lg"
                            options={[
                              { label: "NDA", value: "nda" },
                              { label: "MSA", value: "msa" },
                              { label: "SOW", value: "sow" },
                            ]}
                          />
                        </Form.Item>

                        <Form.Item
                          label={
                            <span className="text-sm font-semibold text-gray-700">
                              Title
                            </span>
                          }
                          name="title"
                          rules={[
                            {
                              required: true,
                              message: "Please enter a contract title",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Sales Agreement — Company Name"
                            className="rounded-lg"
                          />
                        </Form.Item>

                        <Form.Item
                          label={
                            <span className="text-sm font-semibold text-gray-700">
                              Contract Number
                            </span>
                          }
                          name="number"
                          rules={[
                            {
                              required: true,
                              message: "Please enter a contract number",
                            },
                          ]}
                        >
                          <Input
                            placeholder="KZ-2025-001"
                            className="rounded-lg"
                          />
                        </Form.Item>

                        <Form.Item
                          label={
                            <span className="text-sm font-semibold text-gray-700">
                              Counterparty
                            </span>
                          }
                          name="counterparty"
                          rules={[
                            {
                              required: true,
                              message: "Please select a counterparty",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select counterparty"
                            className="rounded-lg"
                            options={[
                              { label: "Acme Ltd", value: "acme" },
                              { label: "Globex Corp", value: "globex" },
                            ]}
                          />
                        </Form.Item>

                        <Form.Item
                          label={
                            <span className="text-sm font-semibold text-gray-700">
                              Company
                            </span>
                          }
                          name="company"
                          rules={[
                            {
                              required: true,
                              message: "Please select a company",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select company"
                            className="rounded-lg"
                            options={[
                              { label: "MyCo", value: "myco" },
                              { label: "OtherCo", value: "otherco" },
                            ]}
                          />
                        </Form.Item>

                        <Form.Item
                          label={
                            <span className="text-sm font-semibold text-gray-700">
                              Owner
                            </span>
                          }
                          name="owner"
                          rules={[
                            {
                              required: true,
                              message: "Please select an owner",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Responsible person"
                            className="rounded-lg"
                            options={[
                              { label: "Alice", value: "alice" },
                              { label: "Bob", value: "bob" },
                            ]}
                          />
                        </Form.Item>

                        <Form.Item
                          label={
                            <span className="text-sm font-semibold text-gray-700">
                              Originating Party
                            </span>
                          }
                          name="origin"
                        >
                          <Select
                            placeholder="Who sent it?"
                            className="rounded-lg"
                            options={[{ label: "External", value: "ext" }]}
                          />
                        </Form.Item>
                      </TwoCol>

                      <Form.Item
                        label={
                          <span className="text-sm font-semibold text-gray-700">
                            Term Type
                          </span>
                        }
                        name="termType"
                      >
                        <Radio.Group className="w-full">
                          <div className="grid grid-cols-3 gap-3">
                            <Radio.Button
                              value="fixed"
                              className="text-center rounded-lg"
                            >
                              Fixed
                            </Radio.Button>
                            <Radio.Button
                              value="auto"
                              className="text-center rounded-lg"
                            >
                              Auto-renew
                            </Radio.Button>
                            <Radio.Button
                              value="evergreen"
                              className="text-center rounded-lg"
                            >
                              Evergreen
                            </Radio.Button>
                          </div>
                        </Radio.Group>
                      </Form.Item>
                    </Section>

                    {/* DATE RANGE */}
                    <Section title="Date Range">
                      <TwoCol>
                        <Form.Item
                          label={
                            <span className="text-sm font-semibold text-gray-700">
                              Start Date
                            </span>
                          }
                          name="startDate"
                          rules={[
                            {
                              required: true,
                              message: "Please pick a start date",
                            },
                          ]}
                        >
                          <DatePicker className="w-full rounded-lg" />
                        </Form.Item>

                        <Form.Item
                          label={
                            <span className="text-sm font-semibold text-gray-700">
                              End Date
                            </span>
                          }
                          name="endDate"
                          rules={[
                            {
                              required: true,
                              message: "Please pick an end date",
                            },
                          ]}
                        >
                          <DatePicker className="w-full rounded-lg" />
                        </Form.Item>

                        <Form.Item
                          label={
                            <span className="text-sm font-semibold text-gray-700">
                              Notice Period (days)
                            </span>
                          }
                          name="noticePeriod"
                        >
                          <InputNumber
                            className="w-full rounded-lg"
                            min={0}
                            placeholder="e.g. 30"
                          />
                        </Form.Item>
                      </TwoCol>
                    </Section>

                    {/* VALUE */}
                    <Section title="Value & Currency">
                      <TwoCol>
                        <Form.Item
                          label={
                            <span className="text-sm font-semibold text-gray-700">
                              Total Contract Value
                            </span>
                          }
                          name="totalValue"
                        >
                          <InputNumber
                            className="w-full rounded-lg"
                            min={0}
                            formatter={(v) => (v ? `${v}` : "")}
                          />
                        </Form.Item>

                        <Form.Item
                          label={
                            <span className="text-sm font-semibold text-gray-700">
                              Currency
                            </span>
                          }
                          name="currency"
                        >
                          <Select
                            placeholder="USD / INR"
                            className="rounded-lg"
                            options={[
                              { label: "USD", value: "USD" },
                              { label: "INR", value: "INR" },
                            ]}
                          />
                        </Form.Item>
                      </TwoCol>

                      <Form.Item
                        label={
                          <span className="text-sm font-semibold text-gray-700">
                            Auto-Renew
                          </span>
                        }
                        name="autoRenew"
                        valuePropName="checked"
                      >
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl border border-gray-100">
                          <Switch />
                          <span className="text-sm text-gray-600 font-medium">
                            Enable automatic renewal
                          </span>
                        </div>
                      </Form.Item>
                    </Section>
                  </div>

                  {/* Right Column - Documents & Notes */}
                  <div className="xl:col-span-1 space-y-6">
                    {/* DOCUMENTS */}
                    <Section title="Documents" className="sticky top-6">
                      <Form.Item
                        name="documents"
                        valuePropName="fileList"
                        getValueFromEvent={() => fileList}
                      >
                        <Dragger
                          multiple
                          fileList={fileList}
                          beforeUpload={(file) => {
                            setFileList((prev) => [...prev, file]);
                            return false;
                          }}
                          onRemove={(file) => {
                            setFileList((prev) =>
                              prev.filter((f) => f.uid !== file.uid)
                            );
                          }}
                          accept=".pdf,.doc,.docx,.txt"
                          className="rounded-xl border-dashed border-2 border-gray-200 hover:border-emerald-400 transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50"
                        >
                          <p className="ant-upload-drag-icon">
                            <UploadOutlined className="text-emerald-500" />
                          </p>
                          <p className="ant-upload-text font-bold text-gray-800">
                            Drop files here
                          </p>
                          <p className="ant-upload-hint text-xs text-gray-500 mt-2">
                            PDF, DOCX, TXT supported
                          </p>
                        </Dragger>
                      </Form.Item>

                      <Form.Item
                        label={
                          <span className="text-sm font-semibold text-gray-700">
                            Notes / Summary
                          </span>
                        }
                        name="notes"
                      >
                        <TextArea
                          rows={4}
                          placeholder="Add any summary or metadata for this contract"
                          className="rounded-xl"
                        />
                      </Form.Item>
                    </Section>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-none bg-white/80 backdrop-blur-xl border-t border-gray-200/50 shadow-lg">
          <div className="px-8 py-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-500 hidden lg:block">
                All fields marked with <span className="text-red-500">*</span>{" "}
                are required
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  onClick={handleBack}
                  className="flex-1 sm:flex-none rounded-xl px-5 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    form.validateFields().then((vals) => {
                      console.log("Draft:", vals);
                      message.success("Draft saved locally");
                    });
                  }}
                  className="flex-1 sm:flex-none rounded-xl px-5 bg-gradient-to-r from-gray-50 to-gray-100 hover:shadow-sm transition-all duration-200"
                >
                  Save Draft
                </Button>
                <Button
                  type="primary"
                  onClick={() => form.submit()}
                  className="flex-1 sm:flex-none rounded-xl px-8 bg-gradient-to-r from-emerald-600 to-teal-600 border-0 shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-300 font-semibold"
                  loading={saving}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
