/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useEffect,
  useState,
} from "react";
import { Form, Button, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
// import type { UploadFile } from "antd/es/upload/interface";
import FullscreenLoader from "../../components/ui/FullScreenLoader";
import {
  fetchAreas,
  fetchTypes,
  fetchCompanies,
  fetchCounterparties,
  fetchOwners,
  createContract,
} from "../../services/formcontract";
export default function CreateContractPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [counterparties, setCounterparties] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const [areasRes, typesRes, companiesRes, counterpartiesRes, ownersRes] =
          await Promise.all([
            fetchAreas(),
            fetchTypes(),
            fetchCompanies(),
            fetchCounterparties(),
            fetchOwners(),
          ]);
        setAreas(areasRes);
        setTypes(typesRes);
        setCompanies(companiesRes);
        setCounterparties(counterpartiesRes);
        setOwners(ownersRes);
      } catch {
        message.error("Failed to load dropdowns");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const files = fileList;
      await createContract(values, files);
      message.success("Contract created successfully");
      navigate("/contracts");
    } catch {
      message.error("Failed to create contract");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <FullscreenLoader />;
  }
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
      {" "}
      {/* Top Gradient */}{" "}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />{" "}
      {/* ================= HEADER ================= */}{" "}
      <div className="mx-8 my-4 flex items-center">
        {" "}
        <div>
          {" "}
          <h3 className="text-2xl font-black tracking-tight text-gray-900">
            {" "}
            Create New Contract{" "}
          </h3>{" "}
        </div>{" "}
        <div className="ml-auto">
          {" "}
          <button
            type="button"
            onClick={() => navigate("/contracts")}
            className=" flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 transition-all duration-200 hover:bg-emerald-100 hover:border-emerald-300 hover:-translate-y-[1px] active:translate-y-0 "
          >
            {" "}
            <ArrowLeftOutlined /> Back{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* ================= FORM ================= */}{" "}
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{ termType: "fixed", autoRenew: false }}
      >
        {" "}
        <div className="px-8 pb-8 space-y-6">
          {" "}
          {/* ================= BASIC INFO ================= */}{" "}
          {/* Section 1: Basic Information */}{" "}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/80 rounded-2xl p-6 shadow-sm">
            {" "}
            <div className="flex items-center gap-2 mb-6">
              {" "}
              <div className="w-1 h-5 bg-blue-500 rounded-full"></div>{" "}
              <h3 className="text-base font-semibold text-gray-800">
                {" "}
                Basic Information{" "}
              </h3>{" "}
            </div>{" "}
            <div className="space-y-5">
              {" "}
              {/* First Row - Selects */}{" "}
              <div className="grid grid-cols-4 gap-6">
                {" "}
                <div className="flex flex-col">
                  {" "}
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    {" "}
                    Area <span className="text-red-500">*</span>{" "}
                  </label>{" "}
                  <select
                    name="area"
                    className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    {" "}
                    <option value="">Select area</option>{" "}
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {" "}
                        {a.name}{" "}
                      </option>
                    ))}{" "}
                  </select>{" "}
                </div>{" "}
                <div className="flex flex-col">
                  {" "}
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    {" "}
                    Type <span className="text-red-500">*</span>{" "}
                  </label>{" "}
                  <select
                    name="type"
                    className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    {" "}
                    <option value="">Select type</option>{" "}
                    {types.map((t) => (
                      <option key={t.id} value={t.id}>
                        {" "}
                        {t.name}{" "}
                      </option>
                    ))}{" "}
                  </select>{" "}
                </div>{" "}
                <div className="flex flex-col">
                  {" "}
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    {" "}
                    Company <span className="text-red-500">*</span>{" "}
                  </label>{" "}
                  <select
                    name="company"
                    className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    {" "}
                    <option value="">Select company</option>{" "}
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {" "}
                        {c.name}{" "}
                      </option>
                    ))}{" "}
                  </select>{" "}
                </div>{" "}
                <div className="flex flex-col">
                  {" "}
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    {" "}
                    Owner{" "}
                  </label>{" "}
                  <select
                    name="owner"
                    className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    {" "}
                    <option value="">Select owner</option>{" "}
                    {owners.map((o) => (
                      <option key={o.id} value={o.id}>
                        {" "}
                        {o.displayName}{" "}
                      </option>
                    ))}{" "}
                  </select>{" "}
                </div>{" "}
              </div>{" "}
              {/* Divider */}{" "}
              <div className="border-t border-gray-200/60"></div>{" "}
              {/* Second Row - Text Inputs & Select */}{" "}
              <div className="grid grid-cols-3 gap-6">
                {" "}
                <div className="flex flex-col">
                  {" "}
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    {" "}
                    Title <span className="text-red-500">*</span>{" "}
                  </label>{" "}
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter contract title"
                    className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />{" "}
                </div>{" "}
                <div className="flex flex-col">
                  {" "}
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    {" "}
                    Number <span className="text-red-500">*</span>{" "}
                  </label>{" "}
                  <input
                    type="text"
                    name="number"
                    placeholder="Enter contract number"
                    className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />{" "}
                </div>{" "}
                <div className="flex flex-col">
                  {" "}
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    {" "}
                    Counterparty <span className="text-red-500">*</span>{" "}
                  </label>{" "}
                  <select
                    name="counterparty"
                    className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    {" "}
                    <option value="">Select counterparty</option>{" "}
                    {counterparties.map((c) => (
                      <option key={c.id} value={c.id}>
                        {" "}
                        {c.displayName}{" "}
                      </option>
                    ))}{" "}
                  </select>{" "}
                </div>{" "}
              </div>{" "}
              {/* Third Row - Originating Party */}{" "}
              <div className="grid grid-cols-3 gap-6">
                {" "}
                <div className="flex flex-col">
                  {" "}
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    {" "}
                    Originating Party{" "}
                    <span className="text-red-500">*</span>{" "}
                  </label>{" "}
                  <select
                    name="originatingParty"
                    className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    {" "}
                    <option value="">Select party</option>{" "}
                    <option value="Company">Company</option>{" "}
                    <option value="Counterparty">Counterparty</option>{" "}
                    <option value="Both">Both</option>{" "}
                  </select>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Section 2: Term & Value */}{" "}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/80 rounded-2xl p-6 shadow-sm">
            {" "}
            <div className="flex items-center gap-2 mb-6">
              {" "}
              <div className="w-1 h-5 bg-blue-500 rounded-full"></div>{" "}
              <h3 className="text-base font-semibold text-gray-800">
                {" "}
                Term & Value{" "}
              </h3>{" "}
            </div>{" "}
            <div className="space-y-5">
              {" "}
              {/* First Row - Term Type & Auto Renew */}{" "}
              <div className="grid grid-cols-12 gap-4 items-end">
                {" "}
                <div className="col-span-6">
                  {" "}
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    {" "}
                    Term Type{" "}
                  </label>{" "}
                  <div className="flex gap-3">
                    {" "}
                    <label className="flex-1 text-center border-2 border-gray-200 rounded-lg px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                      {" "}
                      <input
                        type="radio"
                        name="termType"
                        value="fixed"
                        className="sr-only"
                      />{" "}
                      <span className="text-sm font-medium text-gray-700">
                        {" "}
                        Fixed{" "}
                      </span>{" "}
                    </label>{" "}
                    <label className="flex-1 text-center border-2 border-gray-200 rounded-lg px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                      {" "}
                      <input
                        type="radio"
                        name="termType"
                        value="auto"
                        className="sr-only"
                      />{" "}
                      <span className="text-sm font-medium text-gray-700">
                        {" "}
                        Auto{" "}
                      </span>{" "}
                    </label>{" "}
                    <label className="flex-1 text-center border-2 border-gray-200 rounded-lg px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                      {" "}
                      <input
                        type="radio"
                        name="termType"
                        value="evergreen"
                        className="sr-only"
                      />{" "}
                      <span className="text-sm font-medium text-gray-700">
                        {" "}
                        Evergreen{" "}
                      </span>{" "}
                    </label>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="col-span-6 flex justify-end">
                  {" "}
                  <label className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2.5 cursor-pointer hover:border-blue-400 transition-colors">
                    {" "}
                    <input
                      type="checkbox"
                      name="autoRenew"
                      className="w-11 h-6 appearance-none bg-gray-300 rounded-full relative cursor-pointer transition-colors checked:bg-blue-500 before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-5"
                    />{" "}
                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Auto Renew{" "}
                    </span>{" "}
                  </label>{" "}
                </div>{" "}
              </div>{" "}
              {/* Divider */}{" "}
              <div className="border-t border-gray-200/60"></div>{" "}
              {/* Second Row - Dates */}{" "}
              <div className="grid grid-cols-2 gap-6">
                {" "}
                <div className="flex flex-col">
                  {" "}
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    {" "}
                    Start Date <span className="text-red-500">*</span>{" "}
                  </label>{" "}
                  <input
                    type="date"
                    name="startDate"
                    className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />{" "}
                </div>{" "}
                <div className="flex flex-col">
                  {" "}
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    {" "}
                    End Date <span className="text-red-500">*</span>{" "}
                  </label>{" "}
                  <input
                    type="date"
                    name="endDate"
                    className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />{" "}
                </div>{" "}
              </div>{" "}
              {/* Third Row - Notice Period & Total Value */}{" "}
              <div className="grid grid-cols-2 gap-6">
                {" "}
                <div className="flex flex-col">
                  {" "}
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    {" "}
                    Notice Period <span className="text-red-500">*</span>{" "}
                  </label>{" "}
                  <div className="flex gap-3">
                    {" "}
                    <input
                      type="number"
                      name="noticePeriodValue"
                      min="1"
                      placeholder="Enter value"
                      className="flex-1 h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />{" "}
                    <select
                      name="noticePeriodUnit"
                      className="w-32 h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      {" "}
                      <option value="">Unit</option>{" "}
                      <option value="days">Days</option>{" "}
                      <option value="months">Months</option>{" "}
                      <option value="years">Years</option>{" "}
                    </select>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="flex flex-col">
                  {" "}
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    {" "}
                    Total Value <span className="text-red-500">*</span>{" "}
                  </label>{" "}
                  <div className="flex gap-3">
                    {" "}
                    <input
                      type="number"
                      name="totalValueAmount"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="flex-1 h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />{" "}
                    <select
                      name="totalValueCurrency"
                      className="w-28 h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      {" "}
                      <option value="">Currency</option>{" "}
                      <option value="USD">USD</option>{" "}
                      <option value="INR">INR</option>{" "}
                    </select>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Section 3: Attachments */}{" "}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/80 rounded-2xl p-6 shadow-sm">
            {" "}
            <div className="flex items-center gap-2 mb-6">
              {" "}
              <div className="w-1 h-5 bg-purple-500 rounded-full"></div>{" "}
              <h3 className="text-base font-semibold text-gray-800">
                {" "}
                Attachments{" "}
              </h3>{" "}
            </div>{" "}
            <div className="flex flex-col">
              {" "}
              <label className="text-sm font-medium text-gray-700 mb-3">
                {" "}
                Documents{" "}
              </label>{" "}
              {/* Upload Area */}{" "}
              <div
                className="relative border-2 border-dashed border-gray-300 rounded-xl bg-white hover:border-purple-400 transition-colors cursor-pointer"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                {" "}
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      const fileArray: File[] = [];
                      for (let i = 0; i < files.length; i++) {
                        fileArray.push(files[i]);
                      }
                      setFileList((prev) => [...prev, ...fileArray]);
                    }
                  }}
                />{" "}
                <div className="flex flex-col items-center justify-center py-10">
                  {" "}
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-3">
                    {" "}
                    <svg
                      className="w-6 h-6 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {" "}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />{" "}
                    </svg>{" "}
                  </div>{" "}
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {" "}
                    Click or drag files to upload{" "}
                  </p>{" "}
                  <p className="text-xs text-gray-500">
                    {" "}
                    PDF, DOC, XLS up to 10MB{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              {/* File List */}{" "}
              {fileList.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {" "}
                  {fileList.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 transition-colors group"
                    >
                      {" "}
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        {" "}
                        <svg
                          className="w-5 h-5 text-purple-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {" "}
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />{" "}
                        </svg>{" "}
                      </div>{" "}
                      <div className="flex-1 min-w-0">
                        {" "}
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {" "}
                          {file.name}{" "}
                        </p>{" "}
                      </div>{" "}
                      <button
                        type="button"
                        onClick={() =>
                          setFileList((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                        className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        {" "}
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {" "}
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />{" "}
                        </svg>{" "}
                      </button>{" "}
                    </div>
                  ))}{" "}
                </div>
              )}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* ================= FOOTER ================= */}{" "}
        <div className=" sticky bottom-0 z-10 bg-white/90 backdrop-blur border-t border-gray-200 px-8 py-4 flex justify-end gap-3 ">
          {" "}
          <Button className="rounded-lg px-5" onClick={() => navigate(-1)}>
            {" "}
            Cancel{" "}
          </Button>{" "}
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="rounded-lg px-6 font-semibold"
          >
            {" "}
            Submit{" "}
          </Button>{" "}
        </div>{" "}
      </Form>{" "}
    </div>
  );
}
