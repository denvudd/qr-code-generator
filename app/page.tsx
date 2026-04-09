"use client";

import { useState, useRef } from "react";
import {
  QRCode,
  Input,
  Button,
  Slider,
  ColorPicker,
  Select,
  message,
  Divider,
  Space,
  Card,
} from "antd";
import { CopyOutlined, DownloadOutlined } from "@ant-design/icons";
import type { Color } from "antd/es/color-picker";

export default function Home() {
  const [url, setUrl] = useState("https://ant.design");
  const [size, setSize] = useState(200);
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [iconUrl, setIconUrl] = useState("");
  const [iconSize, setIconSize] = useState(40);
  const qrRef = useRef<HTMLDivElement>(null);

  const copyQRCode = async () => {
    try {
      const canvas = qrRef.current?.querySelector("canvas");

      if (canvas) {
        canvas.toBlob(async (blob) => {
          if (blob) {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
            message.success("QR код скопійовано в буфер обміну!");
          }
        });
      }
    } catch (error) {
      message.error("Помилка копіювання QR коду");
    }
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector("canvas");

    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement("a");
      a.download = "qrcode.png";
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      message.success("QR код завантажено!");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-3 text-gray-800">
          Генератор QR Кодів
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Створюйте персоналізовані QR коди з вашими посиланнями
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-xl rounded-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
              Налаштування
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Посилання або текст
                </label>
                <Input
                  size="large"
                  placeholder="Введіть URL або текст"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="rounded-lg"
                />
              </div>

              <Divider className="my-4" />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Розмір: {size}px
                </label>
                <Slider
                  min={100}
                  max={400}
                  value={size}
                  onChange={setSize}
                  tooltip={{ open: false }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Колір QR коду
                </label>
                <ColorPicker
                  value={color}
                  onChange={(value: Color) => setColor(value.toHexString())}
                  showText
                  size="large"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Колір фону
                </label>
                <ColorPicker
                  value={bgColor}
                  onChange={(value: Color) => setBgColor(value.toHexString())}
                  showText
                  size="large"
                  className="w-full"
                />
              </div>

              <Divider className="my-4">Опціонально</Divider>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL іконки (лого в центрі)
                </label>
                <Input
                  size="large"
                  placeholder="https://example.com/logo.png"
                  value={iconUrl}
                  onChange={(e) => setIconUrl(e.target.value)}
                  className="rounded-lg"
                />
              </div>

              {iconUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Розмір іконки: {iconSize}px
                  </label>
                  <Slider
                    min={20}
                    max={80}
                    value={iconSize}
                    onChange={setIconSize}
                    tooltip={{ open: false }}
                  />
                </div>
              )}
            </div>
          </Card>

          <Card className="shadow-xl rounded-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
              Попередній перегляд
            </h2>

            <div className="flex flex-col items-center justify-center">
              <div
                ref={qrRef}
                className="bg-white p-8 rounded-2xl shadow-lg mb-6"
                style={{
                  backgroundColor: bgColor,
                }}
              >
                {url ? (
                  <QRCode
                    value={url}
                    size={size}
                    color={color}
                    bgColor={bgColor}
                    errorLevel={errorLevel}
                    icon={iconUrl || undefined}
                    iconSize={iconUrl ? iconSize : undefined}
                  />
                ) : (
                  <div
                    className="flex items-center justify-center text-gray-400"
                    style={{ width: size, height: size }}
                  >
                    Введіть текст
                  </div>
                )}
              </div>

              {url && (
                <Space size="large" className="w-full justify-center">
                  <Button
                    type="primary"
                    size="large"
                    icon={<CopyOutlined />}
                    onClick={copyQRCode}
                    className="bg-blue-600 hover:bg-blue-700 rounded-lg px-8"
                  >
                    Копіювати
                  </Button>
                  <Button
                    type="default"
                    size="large"
                    icon={<DownloadOutlined />}
                    onClick={downloadQRCode}
                    className="rounded-lg px-8"
                  >
                    Завантажити
                  </Button>
                </Space>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
