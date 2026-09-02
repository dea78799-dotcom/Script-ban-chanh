-- [[ TẢI RAYFIELD ]]
local Rayfield = loadstring(game:HttpGet('https://sirius.menu/rayfield'))()

-- [[ CỬA SỔ CHÍNH ]]
local Window = Rayfield:CreateWindow({
   Name = "🍋 Lemon Tycoon Hub",
   Icon = 0,
   LoadingTitle = "Đang tải...",
   LoadingSubtitle = "by Assistant",
   ConfigurationSaving = { Enabled = false },
   Discord = { Enabled = false },
   KeySystem = false
})

-- SERVICES
local Players = game:GetService("Players")
local Player = Players.LocalPlayer
local Character = Player.Character or Player.CharacterAdded:Wait()
local RootPart = Character:WaitForChild("HumanoidRootPart")
local Workspace = game:GetService("Workspace")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- STATE
local _G_AutoUpgrade = false
local _G_AutoHarvest = false

-- ============================
-- HÀM TÌM TẤT CẢ REMOTE UPGRADE LIÊN QUAN MỘT LẦN
-- ============================
local upgradeKeywords = {"LemonDash", "Lemon Stand", "Lemon Depot", "Lemon Trading"}

local function scanUpgradeRemotes()
    local remotes = {}
    for _, v in pairs(game:GetDescendants()) do
        if v:IsA("RemoteFunction") and v.Name == "Upgrade" then
            local path = v:GetFullName()
            for _, keyword in ipairs(upgradeKeywords) do
                if path:find(keyword, 1, true) then
                    table.insert(remotes, v)
                    break
                end
            end
        end
    end
    return remotes
end

-- ============================
-- HÀM DỊCH CHUYỂN TỨC THÌ (KHÔNG TWEEN)
-- ============================
local function instantTeleport(pos)
    if not RootPart then return end
    RootPart.CFrame = CFrame.new(pos)
end

-- ============================
-- HÀM TÌM QUẢ "Fruit" CHỈ TRONG CÁC "LemonTree"
-- ============================
local function FindFruitsInLemonTrees()
    local fruits = {}
    for _, v in pairs(Workspace:GetDescendants()) do
        if v:IsA("BasePart") and v.Name == "Fruit" and v.Parent then
            local parentModel = v:FindFirstAncestor("LemonTree")
            if parentModel and parentModel:IsA("Model") and parentModel.Name == "LemonTree" then
                table.insert(fruits, v)
            end
        end
    end
    return fruits
end

-- ============================
-- HÀM TÌM CLICK DETECTOR TRONG FRUIT
-- ============================
local function FindClickDetector(fruit)
    local clickPart = fruit:FindFirstChild("ClickFruitPart")
    if clickPart then
        local clickDetector = clickPart:FindFirstChildWhichIsA("ClickDetector")
        if clickDetector then
            return clickDetector
        end
    end
    return fruit:FindFirstChildWhichIsA("ClickDetector")
end

-- ============================
-- HÀM CLICK QUẢ (DÙNG fireclickdetector CỦA DELTA)
-- ============================
local function ClickFruit(fruit)
    local clickDetector = FindClickDetector(fruit)
    if not clickDetector then return false end

    if fireclickdetector then
        local success = pcall(function()
            fireclickdetector(clickDetector)
        end)
        if success then return true end
    end

    if clickDetector.MouseClick then
        local success = pcall(function()
            firesignal(clickDetector.MouseClick)
        end)
        if success then return true end
    end

    local core = ReplicatedStorage:FindFirstChild("Core")
    if core then
        local remoteSignal = core:FindFirstChild("RemoteSignal")
        if remoteSignal then
            local clickRemote = remoteSignal:FindFirstChild("ClickFruitService.Clicked")
            if clickRemote then
                local RecipientID = 8.8950749994572
                if clickRemote:IsA("RemoteEvent") then
                    return pcall(function() clickRemote:FireServer(RecipientID, fruit.Position, false) end)
                elseif clickRemote:IsA("RemoteFunction") then
                    return pcall(function() clickRemote:InvokeServer(RecipientID, fruit.Position, false) end)
                end
            end
        end
    end

    return false
end

-- ============================
-- HÀM HÁI QUẢ MỘT VÒNG (TỐI ƯU TỐC ĐỘ)
-- ============================
local function HarvestOnce()
    local fruits = FindFruitsInLemonTrees()
    if #fruits == 0 then return false end

    for _, fruit in ipairs(fruits) do
        if not _G_AutoHarvest then break end
        if fruit and fruit.Parent then
            instantTeleport(fruit.Position)
            task.wait(0.02)

            ClickFruit(fruit)

            local waitTime = 0
            while fruit.Parent and waitTime < 0.2 do
                task.wait(0.02)
                waitTime = waitTime + 0.02
            end

            task.wait(0.02)
        end
    end
    return true
end

-- ============================
-- TAB FARM
-- ============================
local FarmTab = Window:CreateTab("Farm", 4483362458)

FarmTab:CreateParagraph({
    Title = "⚙️ Tự động nâng cấp",
    Content = "Bật để tự động nâng cấp LemonDash, Lemon Stand, Lemon Depot và Lemon Trading (quét nhanh một lần, nâng cấp liên tục tốc độ cao)."
})

FarmTab:CreateToggle({
    Name = "Nâng cấp",
    CurrentValue = false,
    Flag = "ToggleUpgrade",
    Callback = function(Value)
        _G_AutoUpgrade = Value
        if _G_AutoUpgrade then
            Rayfield:Notify({Title = "✅", Content = "Đã bật tự động nâng cấp!", Duration = 3})
            task.spawn(function()
                local upgradeRemotes = scanUpgradeRemotes()
                if #upgradeRemotes == 0 then
                    Rayfield:Notify({Title = "⚠️", Content = "Không tìm thấy Remote nâng cấp nào!", Duration = 3})
                    _G_AutoUpgrade = false
                    setToggleState("ToggleUpgrade", false)
                    return
                end

                local lastRescan = tick()
                while _G_AutoUpgrade do
                    -- Gọi tất cả remote nâng cấp
                    for _, remote in ipairs(upgradeRemotes) do
                        pcall(function()
                            remote:InvokeServer(1)
                        end)
                    end

                    -- Cứ 2 giây quét lại để cập nhật Tycoon mới
                    if tick() - lastRescan > 2 then
                        upgradeRemotes = scanUpgradeRemotes()
                        lastRescan = tick()
                    end

                    task.wait(0.05)
                end
                Rayfield:Notify({Title = "⏹️", Content = "Đã dừng tự động nâng cấp!", Duration = 3})
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã tắt tự động nâng cấp!", Duration = 3})
        end
    end
})

-- ============================
-- TAB AUTO HARVEST
-- ============================
local HarvestTab = Window:CreateTab("Auto Harvest", 4483362458)

HarvestTab:CreateParagraph({
    Title = "🍋 Tự động hái quả",
    Content = "Bật để tự động dịch chuyển nhanh và click tất cả quả Fruit trong LemonTree."
})

HarvestTab:CreateToggle({
    Name = "Tự động hái quả",
    CurrentValue = false,
    Flag = "ToggleHarvest",
    Callback = function(Value)
        _G_AutoHarvest = Value
        if _G_AutoHarvest then
            Rayfield:Notify({Title = "✅", Content = "Đã bật tự động hái quả!", Duration = 3})
            task.spawn(function()
                while _G_AutoHarvest do
                    local harvested = HarvestOnce()
                    if not harvested then
                        task.wait(0.5)
                    else
                        task.wait(0.2)
                    end
                end
                Rayfield:Notify({Title = "⏹️", Content = "Đã dừng tự động hái quả!", Duration = 3})
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã tắt tự động hái quả!", Duration = 3})
        end
    end
})

-- Thông báo khởi tạo
Rayfield:Notify({Title = "🍋", Content = "Script đã sẵn sàng!", Duration = 3})
