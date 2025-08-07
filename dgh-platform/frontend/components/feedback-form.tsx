"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Star, Send, Loader2, Type, Volume2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"

export function FeedbackForm() {
  const { t } = useLanguage()
  const [isRecording, setIsRecording] = useState(false)
  const [rating, setRating] = useState(0)
  const [textFeedback, setTextFeedback] = useState("")
  const [voiceTranscript, setVoiceTranscript] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState("en")
  const { toast } = useToast()

  const handleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true)
      // Simulation of voice recording
      setTimeout(() => {
        setIsRecording(false)
        setVoiceTranscript(
          "Hello, I am very satisfied with the service I received today. The wait time was reasonable and the staff was very professional.",
        )
        setDetectedLanguage("en")
        toast({
          title: t("feedback.recording_completed"),
          description: t("feedback.voice_transcribed"),
        })
      }, 3000)
    } else {
      setIsRecording(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulation of submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: t("feedback.feedback_sent"),
      description: t("feedback.thank_you"),
    })

    // Reset form
    setRating(0)
    setTextFeedback("")
    setVoiceTranscript("")
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-8">
      {/* Rating Section */}
      <Card className="border-0 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            {("feedback.general_rating")}
          </CardTitle>
          <CardDescription>{t("feedback.rate_experience")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant="ghost"
                size="sm"
                onClick={() => setRating(star)}
                className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-all hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 transition-all ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"}`}
                />
              </Button>
            ))}
          </div>
          {rating > 0 && (
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
            >
              {rating} {rating > 1 ? t("feedback.stars") : t("feedback.star")}
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Feedback Input */}
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/60 dark:bg-gray-800/60">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Text
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Voice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <Card className="border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">{t("feedback.written_feedback")}</CardTitle>
              <CardDescription>{t("feedback.describe_experience")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={t("feedback.placeholder")}
                value={textFeedback}
                onChange={(e) => setTextFeedback(e.target.value)}
                className="min-h-[150px] bg-white/80 dark:bg-gray-900/80 border-white/20 focus:border-blue-300 dark:focus:border-blue-600"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="space-y-4">
          <Card className="border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">{t("feedback.voice_feedback")}</CardTitle>
              <CardDescription>{t("feedback.record_message")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center">
                <Button
                  onClick={handleVoiceRecording}
                  variant={isRecording ? "destructive" : "default"}
                  size="lg"
                  className={`gap-2 px-8 py-4 text-lg transition-all ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="h-6 w-6" />
                      {t("feedback.stop_recording")}
                    </>
                  ) : (
                    <>
                      <Mic className="h-6 w-6" />
                      {t("feedback.start_recording")}
                    </>
                  )}
                </Button>
              </div>

              {isRecording && (
                <div className="text-center">
                  <div className="animate-pulse text-red-500 text-lg font-medium">
                    {t("feedback.recording_in_progress")}
                  </div>
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-8 bg-red-500 rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {voiceTranscript && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="font-medium">{t("feedback.transcription")}</Label>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {t("feedback.detected_language")}: {detectedLanguage.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{voiceTranscript}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Patient Info */}
      <Card className="border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">{t("feedback.patient_info")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientId" className="text-sm font-medium">
                {t("feedback.patient_id")}
              </Label>
              <Input
                id="patientId"
                placeholder="P123456"
                className="bg-white/80 dark:bg-gray-900/80 border-white/20 focus:border-blue-300 dark:focus:border-blue-600"
              />
            </div>
            <div>
              <Label htmlFor="department" className="text-sm font-medium">
                {("feedback.department")}
              </Label>
              <Input
                id="department"
                placeholder="Cardiology"
                className="bg-white/80 dark:bg-gray-900/80 border-white/20 focus:border-blue-300 dark:focus:border-blue-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || (rating === 0 && !textFeedback && !voiceTranscript)}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all py-6 text-lg font-medium"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            {("feedback.sending")}
          </>
        ) : (
          <>
            <Send className="h-5 w-5 mr-2" />
            {("feedback.send_feedback")}
          </>
        )}
      </Button>
    </div>
  )
}
